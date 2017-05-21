/**
 * Created by Paul on 2017-05-20.
 */

import Papa from 'papaparse'
import dl from 'datalib'
import moment from 'moment'

class Book {
    constructor(title, author, isbn, user_rating, average_rating, num_pages, date_read) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.user_rating = user_rating;
        this.average_rating = average_rating;
        this.num_pages = num_pages;
        this.date_read = date_read;
    }
}

function linear_reg(xs, ys){
    let reg = dl.linearRegression(xs, ys);
    return {
        f: (x) => {return reg.intercept + x * reg.slope},
        rss: reg.rss,
        R: reg.R,
        R2: reg.R * reg.R
    }
}

function to_ISO_date(datestr) {
    return datestr.replace(/\//g, "-");
}

function iso_date_to_month(isodatestr){
    if (isodatestr.length === 0) {return "";}
    let parts = isodatestr.split("-");
    return `${parts[0]}-${parts[1]}-01`;
}

function previous_iso_month(isodatestr) {
    return moment(isodatestr).subtract(1, 'months').format("YYYY-MM-DD");
}

function next_iso_month(isodatestr) {
    return moment(isodatestr).add(1, 'months').format("YYYY-MM-DD");
}

function three_month_moving_average(data) {
    // Calculates three month moving average of monthly data. If some of the months don't have data the average
    // is calculated over the remaining ones.
    // data = [{date: *date in YYYY-MM-DD format*, val: *value*, num: *number of aggregated data points*},...]
    let monthsdata = {};
    let months = [];
    data.forEach(m => {
            months.push(m.date);
            monthsdata[m.date] = {val: m.val, num: m.num};
    });
    let out = {x: [], y:[], num: []};
    months.forEach(d => {
        let totalnum = monthsdata[d].num;
        let totalval = monthsdata[d].val * totalnum;
        let nextmonth = next_iso_month(d);
        let prevmonth = previous_iso_month(d);
        if (months.indexOf(prevmonth) > -1) {
            totalval += monthsdata[prevmonth].val * monthsdata[prevmonth].num;
            totalnum += monthsdata[prevmonth].num;
        }
        if (months.indexOf(nextmonth) > -1) {
            totalval += monthsdata[nextmonth].val * monthsdata[nextmonth].num;
            totalnum += monthsdata[nextmonth].num;
        }
        out.x.push(d);
        out.num.push(monthsdata[d].num);
        out.y.push(totalval / totalnum);
    });
    console.log("moving average out:");
    console.log(out);
    return out;
}

export default class Statistics {
    constructor(file) {
        this.file = file;
        this.data = [];
    }

    process_file() {
        let self = this;
        return new Promise( (resolve, reject) => {
            Papa.parse(this.file,
                {complete: (results) => {
                    results.data.forEach(columns => {
                        if (columns[18] === "read"){
                            self.data.push(
                                new Book(
                                    columns[1], // title
                                    columns[2], // author
                                    columns[6], // isbn ("ISBN13")
                                    columns[7] === "0" ? null : parseFloat(columns[7]), // user_rating ("My Rating")
                                    columns[8] === "0" ? null : parseFloat(columns[8]), // average_rating
                                    columns[11] === "" ? null : parseFloat(columns[11]), // num_pages ("Number of Pages"),
                                    to_ISO_date(columns[14]), // date_read
                                ))
                        }
                    });
                    resolve();
                }});

        });
    }

    get user_rating_vs_average_rating() {
        let out = {x: [], y: [], text: []};
        this.data.forEach(book => {
            if (book.user_rating > 0 && book.average_rating > 0){
                out.x.push(book.average_rating);
                out.y.push(book.user_rating);
                out.text.push(`${book.title} (${book.author})`);
            }
        });
        out.regression = linear_reg(out.x, out.y);
        return out;
    }

    get user_rating_vs_num_pages() {
        let out = {x: [], y: [], text: []};
        this.data.forEach(book => {
            if (book.user_rating > 0 && book.num_pages > 0){
                out.y.push(book.user_rating);
                out.x.push(book.num_pages);
                out.text.push(`${book.title} (${book.author})`);
            }
        });
        out.regression = linear_reg(out.x, out.y);
        return out;
    }

    get user_rating_vs_date_read_avg_per_month() {
        let grouped = dl.groupby([
                {name: "date", get: b => iso_date_to_month(b.date_read)},
                {name: "rated", get: b => b.user_rating > 0}])
            .summarize({"user_rating": 'mean', "*": "count"}).execute(this.data);
        console.log(grouped);
        grouped.sort(
            (a,b) => {if (a.date < b.date){return -1;} if (a.date > b.date){return 1;} return 0});
        console.log(grouped);
        let valid_data = [];
        grouped.forEach(m => {
            if (m.rated && m.date.length > 0) {
                valid_data.push({date: m.date, val: m.mean_user_rating, num: m.count});
            }
        });
        console.log(valid_data);
        return three_month_moving_average(valid_data);
    }
}

