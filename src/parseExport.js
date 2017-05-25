/**
 * Created by Paul on 2017-05-24.
 */
import Papa from 'papaparse'
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

function distribute_year(data) {
    let year_start_books = {};
    data.forEach(b => {
        if (b.date_read.month() === 0 && b.date_read.date() === 1) {
            if (!year_start_books.hasOwnProperty(b.date_read)) {
                year_start_books[b.date_read] = [];
            }
            year_start_books[b.date_read].push(b);
        }
    });
    for (let year in year_start_books) {
        if (year_start_books.hasOwnProperty(year) && year_start_books[year].length > 10) {
            let delta = Math.floor(365 / year_start_books[year].length);
            for (let i=0; i < year_start_books[year].length; i++) {
                year_start_books[year][i].date_read.add(delta * i, "days");
            }
        }
    }
}

export default function parseExport(file, data, options) {
    return new Promise((resolve, reject) => {
        Papa.parse(file,
            {
                complete: (results) => {
                    results.data.forEach(columns => {
                        if (columns[18] === "read") {
                            data.push(
                                new Book(
                                    columns[1], // title
                                    columns[2], // author
                                    columns[6], // isbn ("ISBN13")
                                    columns[7] === "0" ? null : parseFloat(columns[7]), // user_rating ("My Rating")
                                    columns[8] === "0" ? null : parseFloat(columns[8]), // average_rating
                                    columns[11] === "" ? null : parseFloat(columns[11]), // num_pages ("Number of Pages"),
                                    moment(columns[14], "YYYY/MM/DD"), // date_read
                                ))
                        }
                    });
                    if (options.distribute_year) {
                        distribute_year(data);
                    }
                    resolve();
                }
            });

    });
}