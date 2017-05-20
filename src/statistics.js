/**
 * Created by Paul on 2017-05-20.
 */

import Papa from 'papaparse'
import dl from 'datalib'

class Book {
    constructor(title, author, isbn, user_rating, average_rating, num_pages) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.user_rating = user_rating;
        this.average_rating = average_rating;
        this.num_pages = num_pages;
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
                                    columns[11], // num_pages ("Number of Pages")
                                ))
                        }
                    });
                    resolve();
                }});

        });
    }

    get user_rating_vs_average_rating() {
        let out = {avg: [], user: []};
        this.data.forEach(book => {
            if (book.user_rating > 0 && book.average_rating > 0){
                out.avg.push(book.average_rating);
                out.user.push(book.user_rating);
            }
        });
        out.regression = linear_reg(out.avg, out.user);
        return out;
    }

    get user_rating_vs_num_pages() {
        let out = {pages: [], user: []};
        this.data.forEach(book => {
            if (book.user_rating > 0 && book.num_pages > 0){
                out.user.push(book.user_rating);
                out.pages.push(book.num_pages);
            }
        });
        out.regression = linear_reg(out.pages, out.user);
        return out;
    }
}

