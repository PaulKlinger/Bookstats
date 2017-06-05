/**
 * Created by Paul on 2017-05-24.
 */
import Papa from 'papaparse'
import moment from 'moment'

import Statistics from './Statistics'

class Book {
    constructor(primary, title, author, isbn, user_rating, average_rating, num_pages, date_started, date_read, author_sort,
                publication_year, genres) {
        this.primary = primary;
        this.title = title;
        this.author = author;
        this.author_sort = author_sort;
        this.isbn = isbn;
        this.user_rating = user_rating;
        this.average_rating = average_rating;
        this.num_pages = num_pages;
        this.date_started = date_started;
        this.date_read = date_read;
        this.publication_year = publication_year;
        this.genres = genres;

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


function parseGenres(genres_string) {
    const genres_sections = genres_string.split(";");

    const genres = [];
    genres_sections.forEach(s => {
        const subgenres_num = s.split("|");
        genres.push({subgenres: subgenres_num[0], num: subgenres_num[1]})
    });
    return genres;
}


function parseReadDates(read_dates_string) {
    const read_dates = [];
    read_dates_string.split(";").forEach(rd => {
        const start_end = rd.split(",");
        read_dates.push({start: moment(start_end[0], "YYYY-MM-DD"), end: moment(start_end[1], "YYYY-MM-DD")})
    });
    return read_dates;
}


export default function parseExport(file, options) {
    return new Promise((resolve, reject) => {
        Papa.parse(file,
            {
                complete: (results) => {
                    const column_names = results.data.shift();
                    // Just check some columns to see if this is a goodreads csv (not exhaustive)
                    if (!(column_names.indexOf("Title") > -1
                        && column_names.indexOf("Author") > -1
                        && column_names.indexOf("Exclusive Shelf") > -1
                        && column_names.indexOf("Date Read") > -1)){
                        reject();
                    }
                    const read_dates_index = column_names.indexOf("read_dates");
                    const genres_index = column_names.indexOf("genres");
                    let data = [];
                    results.data.forEach(columns => {
                        if (columns[column_names.indexOf("Exclusive Shelf")] === "read") {

                            const genres = genres_index === -1 ? undefined : parseGenres(columns[genres_index]);
                            const read_dates = read_dates_index === -1 ? []: parseReadDates(columns[read_dates_index]);
                            if (read_dates.length === 0 && columns[column_names.indexOf("Date Read")] !== ""){
                                read_dates.push({end: moment(columns[column_names.indexOf("Date Read")], "YYYY/MM/DD")})
                            }
                            read_dates.forEach((rd, i) =>{
                                data.push(
                                    new Book(
                                        i === 0, // primary (1 book object per reading, only one primary one)
                                        columns[column_names.indexOf("Title")], // title
                                        columns[column_names.indexOf("Author")], // author
                                        columns[column_names.indexOf("ISBN13")], // isbn
                                        columns[column_names.indexOf("My Rating")] === "0" ? null : parseFloat(columns[7]), // user_rating
                                        columns[column_names.indexOf("Average Rating")] === "0" ? null : parseFloat(columns[8]), // average_rating
                                        columns[column_names.indexOf("Number of Pages")] === "" ? null : parseFloat(columns[11]), // num_pages
                                        rd.start, // date_started
                                        rd.end, // date_read
                                        columns[column_names.indexOf("Author l-f")], // author_sort
                                        columns[column_names.indexOf("Original Publication Year")], // publication_year
                                        genres // genres
                                    ))
                            });
                        }
                    });
                    if (options.distribute_year) {
                        distribute_year(data);
                    }
                    if (data.length > 0) {
                        resolve(new Statistics(data, read_dates_index > -1, genres_index > -1));
                    } else {
                        reject();
                    }
                }
            });

    });
}