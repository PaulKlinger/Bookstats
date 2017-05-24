/**
 * Created by Paul on 2017-05-20.
 */

import dl from 'datalib'
import moment from 'moment'

import parseExport from './parseExport.js';

function linear_reg(xs, ys){
    let reg = dl.linearRegression(xs, ys);
    return {
        f: (x) => {return reg.intercept + x * reg.slope},
        rss: reg.rss,
        R: reg.R,
        R2: reg.R * reg.R
    }
}

function three_month_moving_average(data) {
    // Calculates three month moving average of monthly data. If some of the months don't have data the average
    // is calculated over the remaining ones.
    // data = [{date: *moment*, val: *value*, num: *number of aggregated data points*},...]
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
        let nextmonth = d.add(1, 'month');
        let prevmonth = d.subtract(1, 'month');
        if (months.indexOf(prevmonth) > -1) {
            totalval += monthsdata[prevmonth].val * monthsdata[prevmonth].num;
            totalnum += monthsdata[prevmonth].num;
        }
        if (months.indexOf(nextmonth) > -1) {
            totalval += monthsdata[nextmonth].val * monthsdata[nextmonth].num;
            totalnum += monthsdata[nextmonth].num;
        }
        out.x.push(d.format("YYYY-MM-DD"));
        out.num.push(monthsdata[d].num);
        out.y.push(totalval / totalnum);
    });
    return out;
}

function sliding_window(data, ndays) {
    // calculates mean in sliding window of
    // data = [{date: *date in YYYY-MM-DD format*, val: *value*, num: *number of aggregated data points*},...]
}

export default class Statistics {
    constructor(file) {
        this.file = file;
        this.data = [];
    }

    process_file() {
        return parseExport(this.file, this.data);
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
                {name: "date", get: b => b.date_read.startOf('month')},
                {name: "rated", get: b => b.user_rating > 0}])
            .summarize({"user_rating": 'mean', "*": "count"}).execute(this.data);
        console.log(grouped);
        grouped.sort(
            (a,b) => {return a.date.diff(b.date)});
        console.log(grouped);
        let valid_data = [];
        grouped.forEach(m => {
            if (m.rated && m.date.isValid()) {
                valid_data.push({date: m.date, val: m.mean_user_rating, num: m.count});
            }
        });
        console.log(valid_data);
        return three_month_moving_average(valid_data);
    }
}

