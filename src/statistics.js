/**
 * Created by Paul on 2017-05-20.
 */

import dl from 'datalib'
import moment from 'moment'

import parseExport from './parseExport.js';

function linear_reg(xs, ys) {
    let reg = dl.linearRegression(xs, ys);
    return {
        f: (x) => {
            return reg.intercept + x * reg.slope
        },
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
    let out = {x: [], y: [], y2: []};
    months.forEach(d => {
        let totalnum = monthsdata[d].num;
        let totalval = monthsdata[d].val * totalnum;
        let nextmonth = d.clone().add(1, 'month');
        let prevmonth = d.clone().subtract(1, 'month');
        if (months.indexOf(prevmonth) > -1) {
            totalval += monthsdata[prevmonth].val * monthsdata[prevmonth].num;
            totalnum += monthsdata[prevmonth].num;
        }
        if (months.indexOf(nextmonth) > -1) {
            totalval += monthsdata[nextmonth].val * monthsdata[nextmonth].num;
            totalnum += monthsdata[nextmonth].num;
        }
        out.x.push(d.format("YYYY-MM-DD"));
        out.y2.push(monthsdata[d].num);
        out.y.push(totalval / totalnum);
    });
    return out;
}

function nday_sliding_window(data, ndays, fillval) {
    // calculates mean in sliding window of width ndays
    // data = [{date: *moment*, val: *value*, num: *number of aggregated data points*},...]
    // fillval is the value to assign days with no data (if null they are ignored, 0 they are respected for mean calc)
    // out.y2 total number of datapoints in sliding window if num is given

    let daydata = {};
    data.forEach(d => daydata[d.date] = d);

    let min = moment.min(data.map(d => d.date));
    let max = moment.max(data.map(d => d.date));

    let out = {x: [], y: [], y2: []};

    let day = min.clone();
    let vals = [];
    let nums = [];

    while (day.isSameOrBefore(max)) {
        if (daydata.hasOwnProperty(day)) {
            nums.push(daydata[day].num);
            for (let i = 0; i < (Number.isInteger(daydata[day].num) ? daydata[day].num : 1); i++) {
                vals.push(daydata[day].val);
            }
        } else {
            vals.push(fillval);
            nums.push(0);
        }
        if (vals.length === ndays) {
            out.x.push(day.clone().add(Math.ceil((ndays - 1) / 2), "days").format("YYYY-MM-DD"));
            out.y.push(dl.count.valid(vals) > 0 ? dl.mean(vals) : null);
            out.y2.push(dl.sum(nums));
            vals.shift();
            nums.shift();
        }

        day.add(1, "days");
    }
    return out;
}

export default class Statistics {
    constructor(file) {
        this.file = file;
        this.data = [];
    }

    process_file(options) {
        return parseExport(this.file, this.data, options);
    }

    get user_rating_vs_average_rating() {
        let out = {x: [], y: [], text: []};
        this.data.forEach(book => {
            if (book.user_rating > 0 && book.average_rating > 0) {
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
            if (book.user_rating > 0 && book.num_pages > 0) {
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
            {name: "date", get: b => b.date_read},
            {name: "rated", get: b => b.user_rating > 0}])
            .summarize({"user_rating": 'mean', "*": "count"}).execute(this.data);
        let valid_data = [];
        grouped.forEach(m => {
            if (m.rated && m.date.isValid()) {
                valid_data.push({date: m.date, val: m.mean_user_rating, num: m.count});
            }
        });
        return {data1: nday_sliding_window(valid_data, 31, null)};
    }

    get pages_read_31_day_sliding_window() {
        let grouped = dl.groupby([
            {name: "date", get: b => b.date_read},
            {name: "has_pages", get: b => b.num_pages > 0}])
            .summarize({"num_pages": 'sum', "*": "count"}).execute(this.data);
        console.log(grouped);
        let valid_data_pages = [];
        let valid_data_books = [];
        grouped.forEach(m => {
            if (m.date.isValid()) {
                valid_data_books.push({date: m.date, val: m.count});
                if (m.has_pages) {
                    valid_data_pages.push({date: m.date, val: m.sum_num_pages});
                }
            }
        });
        return {
            data1: nday_sliding_window(valid_data_pages, 31, 0),
            data2: nday_sliding_window(valid_data_books, 31, 0)
        }

    }
}

