/**
 * Created by Paul on 2017-05-24.
 */
import Papa from 'papaparse'
import moment from 'moment'

import Statistics from './Statistics'

class Book {
    constructor(title, author, isbn, user_rating, average_rating, num_pages, date_read, author_sort) {
        this.title = title;
        this.author = author;
        this.author_sort = author_sort;
        this.isbn = isbn;
        this.user_rating = user_rating;
        this.average_rating = average_rating;
        this.num_pages = num_pages;
        this.date_read = date_read;

        this.book_moved = false; // Book date_read has been artificially moved (e.g. to spread Jan 1 books over year)
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
            const n_books = year_start_books[year].length;
            const delta = 365 / n_books;
            for (let i=0; i < n_books; i++) {
                year_start_books[year][i].date_read.add(Math.floor(delta * i), "days");
                year_start_books[year][i].book_moved = true;
            }
        }
    }
}

export default function parseExport(file, options) {
    return new Promise((resolve, reject) => {
        Papa.parse(file,
            {
                complete: (results) => {
                    const column_names = results.data.shift();
                    let data = [];
                    results.data.forEach(columns => {
                        if (columns[18] === "read") {
                            data.push(
                                new Book(
                                    columns[column_names.indexOf("Title")], // title
                                    columns[column_names.indexOf("Author")], // author
                                    columns[column_names.indexOf("ISBN13")], // isbn
                                    columns[column_names.indexOf("My Rating")] === "0" ? null : parseFloat(columns[7]), // user_rating
                                    columns[column_names.indexOf("Average Rating")] === "0" ? null : parseFloat(columns[8]), // average_rating
                                    columns[column_names.indexOf("Number of Pages")] === "" ? null : parseFloat(columns[11]), // num_pages
                                    moment(columns[column_names.indexOf("Date Read")], "YYYY/MM/DD"), // date_read
                                    columns[column_names.indexOf("Author l-f")], // author_sort
                                ))
                        }
                    });
                    if (options.distribute_year) {
                        distribute_year(data);
                    }
                    resolve(new Statistics(data));
                }
            });

    });
}