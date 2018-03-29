/**
 * Created by Paul on 2017-05-20.
 */

import moment from 'moment'

import {isNum, mean, sum, countEach, meanStdDev, weighted_mean, sum_with_multiplicity} from './util.js'


export function nday_sliding_window(data, ndays, fillval, aggregation) {
    // calculates mean in sliding window of width ndays
    // data = [{date: *moment*, val: *value*, num: *number of aggregated data points*},...]
    // fillval is the value to assign days with no data (if null they are ignored, 0 they are respected for mean calc)
    // out.y2 total number of datapoints in sliding window if num is given

    let out = {x: [], y: [], y2: []};
    if (data === undefined) {
        return out;
    }
    let aggregation_func;
    if (aggregation === "mean") {
        aggregation_func = weighted_mean;
    } else if (aggregation === "sum") {
        aggregation_func = sum_with_multiplicity;
    } else {
        console.log("Unknown aggregation: " + aggregation);
        return null
    }

    let daydata = {};
    data.forEach(d => {
        daydata[+d.date] = d
    });

    let min = moment.min(data.map(d => d.date));
    let max = moment.max(data.map(d => d.date));

    let day = min.clone();
    let vals = [];
    let nums = [];

    while (day.isSameOrBefore(max)) {
        if (daydata.hasOwnProperty(+day)) {
            nums.push(daydata[+day].num);
            vals.push(daydata[+day].val);
        } else {
            vals.push(fillval);
            // for fillval==0 the following is correct and for fillval==null the entries are ignored in weighted_mean
            nums.push(1);
        }
        if (vals.length === ndays) {
            out.x.push(day.clone().subtract(Math.ceil((ndays - 1) / 2), "days").format("YYYY-MM-DD"));
            out.y.push(aggregation_func(vals, nums));
            out.y2.push(sum(nums));
            vals.shift();
            nums.shift();
        }

        day.add(1, "days");
    }
    return out;
}

export default class Statistics {
    constructor(data, has_read_dates, has_genres) {
        this.data = data;
        this.data_valid_date_read = data.filter(b => b.date_read.isValid());
        this.data_start_end_dates = this.data_valid_date_read.filter(b => b.date_started.isValid());
        this.data_primary = data.filter(b => b.primary);
        this.has_read_dates = has_read_dates;
        this.has_genres = has_genres;
    }

    get total_pages() {
        if (this._total_pages === undefined) {
            this._total_pages = sum(this.data.map(b => b.num_pages));
        }
        return this._total_pages;
    }

    get user_rating_vs_average_rating() {
        let out = {x: [], y: [], text: []};
        this.data_primary.forEach(book => {
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
        this.data_primary.forEach(book => {
            if (book.user_rating > 0 && book.num_pages > 0) {
                out.y.push(book.user_rating);
                out.x.push(book.num_pages);
                out.text.push(`${book.title} (${book.author})`);
            }
        });
        return out;
    }

    get publication_year_bar() {
        let years = this.data_primary.map(b => b.publication_year).filter(x => x > 0);
        const counts = countEach(years);
        return {x: Object.keys(counts).sort(), y: Object.keys(counts).sort().map(k => counts[k])};
    }

    get publication_year_title() {
        let titles = [];
        const years = this.data_primary.filter(b => b.publication_year > 0).map(b => b.publication_year);
        const yearCounts = countEach(years);
        this.data_primary.filter(b => b.publication_year > 0).forEach(b => {
            titles.push(`${yearCounts[b.publication_year]}<br />${b.title} (${b.author})`);
        });
        return {x: years, text: titles};
    }

    get months_books_read_bar() {
        const months = this.data_valid_date_read.map(b => b.date_read.clone().startOf("month").add(1, "day").toISOString());
        const counts = countEach(months);
        return {x: Object.keys(counts).sort(), y: Object.keys(counts).sort().map(k => counts[k])};
    }

    get books_by_date_read() {
        if (this._books_by_date_read === undefined) {
            let date_to_books = {};
            this.data_valid_date_read.forEach(b => {
                if (!date_to_books.hasOwnProperty(+b.date_read)) {
                    date_to_books[+b.date_read] = {date: b.date_read, books: []};
                }
                date_to_books[+b.date_read].books.push(b);
            });
            this._books_by_date_read = date_to_books;
        }
        return this._books_by_date_read;
    }

    get user_rating_vs_date_read() {
        let valid_data = [];
        let nums_data = [];
        Object.keys(this.books_by_date_read).forEach(d => {
            let ratings = this.books_by_date_read[d].books.map(b => b.user_rating).filter(x => x > 0);
            if (ratings.length > 0) {
                valid_data.push({date: moment(+d), val: mean(ratings), num: ratings.length});
                nums_data.push({date: moment(+d), val: ratings.length, num: 1});
            }
        });
        return {data1: valid_data, data2: nums_data};
    }

    get books_pages_read() {
        const valid_data_pages = [];
        const valid_data_books = [];
        const dots_x = [];
        const dots_y = [];
        const dots_text = [];

        const pages_per_day_from_start_end = {};
        this.data_start_end_dates.forEach(b => {
            const day = b.date_started.clone();
            const reading_days = b.date_read.diff(b.date_started, "days") + 1;
            while (day.isSameOrBefore(b.date_read)) {
                if (!pages_per_day_from_start_end.hasOwnProperty(+day)) {
                    pages_per_day_from_start_end[+day] = 0;
                }
                if (!this.books_by_date_read.hasOwnProperty(+day)) {
                    this.books_by_date_read[+day] = {books: [], date: day};
                }
                pages_per_day_from_start_end[+day] += b.num_pages / reading_days;
                day.add(1, "days");
            }
        });

        Object.keys(this.books_by_date_read).forEach(d => {
            valid_data_books.push({date: moment(+d), val: this.books_by_date_read[d].books.length * 7, num: 1});
            valid_data_pages.push({
                date: moment(+d),
                val: sum(this.books_by_date_read[d].books.filter(b => !b.date_started.isValid()).map(b => b.num_pages))
                + (pages_per_day_from_start_end.hasOwnProperty(d) ? pages_per_day_from_start_end[d] : 0),
                num: 1
            });
            this.books_by_date_read[d].books.forEach((b, i) => {
                dots_x.push(moment(+d).format("YYYY-MM-DD"));
                dots_y.push(i);
                dots_text.push(`${b.title} (${b.author})`);
            })
        });


        return {
            data1: valid_data_pages,
            data2: valid_data_books,
            dots_data: {
                x: dots_x,
                y: dots_y,
                text: dots_text
            }
        }
    }

    get weekday_finish() {
        let counts = countEach(
            this.data_valid_date_read.filter(b => !b.book_moved).map(b => b.date_read.day()));
        return {
            x: ["Mo", "Tu", "Wed", "Th", "Fr", "Sa", "Su"],
            y: [counts[0], counts[1], counts[2], counts[3], counts[4], counts[5], counts[6]]
        };
    }

    get books_by_genre() {
        if (this._books_by_genre === undefined) {
            let genre_to_books = {};
            this.data_primary.filter(b => b.genres !== undefined).forEach(b => {
                b.genres.forEach(g => {
                    if (g.num > 10) {
                        if (!genre_to_books.hasOwnProperty(g.genre_string)) {
                            genre_to_books[g.genre_string] = [];
                        }
                        genre_to_books[g.genre_string].push(b);
                    }
                });
            });
            this._books_by_genre = Object.keys(genre_to_books).map(k => ({genre: k, books: genre_to_books[k]}));
            this._books_by_genre.sort((a, b) => a.books.length - b.books.length);
        }
        return this._books_by_genre;
    }

    get genre_books() {
        return {
            x: this.books_by_genre.map(g => g.genre),
            y: this.books_by_genre.map(g => g.books.length)
        };
    }

    get genre_ratings() {
        const xs = [];
        const ys = [];
        const errors = [];
        this.books_by_genre.slice(-20).forEach(g => {
            const mean_std_dev = meanStdDev(g.books.filter(b => b.user_rating > 0).map(b => b.user_rating));
            xs.push(mean_std_dev.mean);
            errors.push(mean_std_dev.stddev);
            ys.push(g.genre);
        });
        return {xs: xs, ys: ys, errors: errors};
    }

    get author_stats() {
        if (!(this._author_stats === undefined)) {
            return this._author_stats
        }
        let author_books = {};
        this.data_primary.forEach(b => {
            if (!author_books.hasOwnProperty(b.author)) {
                author_books[b.author] = [];
            }
            author_books[b.author].push(b);
        });

        let author_stats = {};
        Object.keys(author_books).forEach(a => {
            author_stats[a] = {
                avg_user_rating: mean(author_books[a].map(b => b.user_rating).filter(r => r > 0)),
                avg_user_rating_2prec: null,
                num_books: author_books[a].length,
                avg_rating_diff: mean(author_books[a].filter(b => b.user_rating > 0).map(b => b.user_rating - b.average_rating)),
                avg_rating_diff_2prec: null,
                author_sort: author_books[a][0].author_sort,
                total_pages: sum(author_books[a].map(b => b.num_pages)),
            };
            if (isNum(author_stats[a].avg_user_rating)) {
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
            total_pages: this.author_stats[a].total_pages,
            avg_user_rating_2prec: this.author_stats[a].avg_user_rating_2prec,
            avg_user_rating: this.author_stats[a].avg_user_rating,
            avg_rating_diff: this.author_stats[a].avg_rating_diff,
            avg_rating_diff_2prec: this.author_stats[a].avg_rating_diff_2prec
        }));
    }

    get author_num_books_vs_avg_user_rating() {
        let out = {x: [], y: [], text: []};
        Object.keys(this.author_stats).forEach(a => {
            if (isNum(this.author_stats[a].avg_user_rating)) {
                out.x.push(this.author_stats[a].num_books);
                out.y.push(this.author_stats[a].avg_user_rating);
                out.text.push(a);
            }
        });
        return out;
    }

    get book_list() {
        return this.data_primary.map(b => ({
            title: b.title, author: b.author, author_sort: b.author_sort,
            user_rating: b.user_rating, avg_rating: b.average_rating,
            avg_rating_2prec: b.average_rating.toPrecision(2),
            rating_diff: b.user_rating === null ? null : b.user_rating - b.average_rating,
            rating_diff_2prec: b.user_rating === null ? null : (b.user_rating - b.average_rating).toPrecision(2)
        }))
    }

    get pages_and_title() {
        const books_with_pages = this.data_primary.filter(b => b.num_pages > 0);
        return {
            x: books_with_pages.map(b => b.num_pages),
            text: books_with_pages.map(b => `${b.title} (${b.author})`)
        };
    }

    get avgrating_and_title() {
        const books_with_avg_rating = this.data_primary.filter(b => b.average_rating > 0);
        return {
            x: books_with_avg_rating.map(b => b.average_rating),
            text: books_with_avg_rating.map(b => `${b.title} (${b.author})`)
        }
    }
}