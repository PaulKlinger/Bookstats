/**
 * Created by Paul on 2017-05-20.
 */

import moment from 'moment'

import parseExport from './parseExport.js';

import {isNum, mean, sum, countEach} from './util.js'


function nday_sliding_window(data, ndays, fillval) {
    // calculates mean in sliding window of width ndays
    // data = [{date: *moment*, val: *value*, num: *number of aggregated data points*},...]
    // fillval is the value to assign days with no data (if null they are ignored, 0 they are respected for mean calc)
    // out.y2 total number of datapoints in sliding window if num is given

    let daydata = {};
    data.forEach(d => {daydata[d.date] = d});

    let min = moment.min(data.map(d => d.date));
    let max = moment.max(data.map(d => d.date));

    let out = {x: [], y: [], y2: []};

    let day = min.clone();
    let vals = [];
    let nums = [];

    while (day.isSameOrBefore(max)) {
        if (daydata.hasOwnProperty(day)) {
            nums.push(daydata[day].num);
            for (let i = 0; i < (isNum(daydata[day].num) ? daydata[day].num : 1); i++) {
                vals.push(daydata[day].val);
            }
        } else {
            vals.push(fillval);
            nums.push(0);
        }
        if (vals.length === ndays) {
            out.x.push(day.clone().add(Math.ceil((ndays - 1) / 2), "days").format("YYYY-MM-DD"));
            out.y.push(mean(vals));
            out.y2.push(sum(nums));
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
        return out;
    }

    get books_by_date_read() {
        if (this._books_by_date_read === undefined) {
            let date_to_books = {};
            this.data.filter(b => b.date_read.isValid()).forEach(b => {
                if (!date_to_books.hasOwnProperty(b.date_read)) {
                    date_to_books[b.date_read] = {date: b.date_read, books: []};
                }
                date_to_books[b.date_read].books.push(b);
            });
            this._books_by_date_read = Object.keys(date_to_books).map(k => date_to_books[k]);
        }
        return this._books_by_date_read;
    }

    get user_rating_vs_date_read_sliding_window() {
        let valid_data = [];
        this.books_by_date_read.forEach(d => {
                let ratings = d.books.map(b => b.user_rating).filter(x => x > 0);
                if (ratings.length > 0) {
                    valid_data.push({date: d.date, val: mean(ratings), num: ratings.length});
                }
        });
        return {data1: nday_sliding_window(valid_data, 61, null)};
    }

    get pages_read_31_day_sliding_window() {
        let valid_data_pages = [];
        let valid_data_books = [];
        this.books_by_date_read.forEach(d => {
                valid_data_books.push({date: d.date, val: d.books.length});
                valid_data_pages.push({date: d.date, val: sum(d.books.map(b => b.num_pages))});
        });
        return {
            data1: nday_sliding_window(valid_data_pages, 61, 0),
            data2: nday_sliding_window(valid_data_books, 61, 0)
        }
    }

    get weekday_finish() {
        let counts = countEach(
            this.data.filter(b => b.date_read.isValid() && !b.book_moved).map(b => b.date_read.day()));
        return {
            x: ["Mo", "Tu", "Wed", "Th", "Fr", "Sa", "Su"],
            y: [counts[0], counts[1], counts[2], counts[3], counts[4], counts[5], counts[6]]
        };

    }

    get author_stats() {
        if (!(this._author_stats === undefined)) {
            return this._author_stats
        }
        let author_books = {};
        this.data.forEach(b => {
            if (!author_books.hasOwnProperty(b.author)) {
                author_books[b.author] = [];
            }
            author_books[b.author].push(b);
        });

        let author_stats = {};
        Object.keys(author_books).forEach(a => {
            author_stats[a] = {
                avg_user_rating: mean(author_books[a].map(b => b.user_rating).filter(r => r >0)),
                avg_user_rating_2prec: null,
                num_books: author_books[a].length,
                avg_rating_diff: mean(author_books[a].filter(b => b.user_rating > 0).map(b => b.user_rating - b.average_rating)),
                avg_rating_diff_2prec: null,
                author_sort: author_books[a][0].author_sort
            };
            if (isNum(author_stats[a].avg_user_rating)){
                author_stats[a].avg_user_rating_2prec = author_stats[a].avg_user_rating.toPrecision(2);
                author_stats[a].avg_rating_diff_2prec = author_stats[a].avg_rating_diff.toPrecision(2);
            }
        });

        this._author_stats = author_stats;
        return author_stats;
    }

    get author_stats_list() {
        return Object.keys(this.author_stats).map(a => ({
            author: a,
            author_sort: this.author_stats[a].author_sort,
            num_books: this.author_stats[a].num_books,
            avg_user_rating_2prec: this.author_stats[a].avg_user_rating_2prec,
            avg_user_rating: this.author_stats[a].avg_user_rating,
            avg_rating_diff: this.author_stats[a].avg_rating_diff,
            avg_rating_diff_2prec: this.author_stats[a].avg_rating_diff_2prec
        }));
    }

    get author_num_books_vs_avg_user_rating() {
        let out = {x: [], y: [], text: []};
        Object.keys(this.author_stats).forEach(a => {
            if (isNum(this.author_stats[a].avg_user_rating)){
                out.x.push(this.author_stats[a].num_books);
                out.y.push(this.author_stats[a].avg_user_rating);
                out.text.push(a);
            }
        });
        return out;
    }
}