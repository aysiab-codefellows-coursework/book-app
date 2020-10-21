DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    description TEXT
);

INSERT INTO books (author, title, isbn, image_url, description) VALUES ('J. R. R. Tolkien', 'Lord of the Rings','0606295674','http://books.google.com/books/content?id=8NjFAQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api','Presents the epic depicting the Great War of the Ring, a struggle between good and evil in Middle Earth.');
INSERT INTO books (author, title, isbn, image_url, description) VALUES ('Stephen King', 'It','9781501141232','http://books.google.com/books/content?id=-rUACwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','It: Chapter Two—now a major motion picture! Stephen King’s terrifying, classic #1 New York Times bestseller, “a landmark in American literature” (Chicago Sun-Times)—about seven adults who return to their hometown to confront a nightmare they had first stumbled on as teenagers…an evil without a name: It. Welcome to Derry, Maine. It’s a small city, a place as hauntingly familiar as your own hometown. Only in Derry the haunting is real. They were seven teenagers when they first stumbled upon the horror. Now they are grown-up men and women who have gone out into the big world to gain success and happiness. But the promise they made twenty-eight years ago calls them reunite in the same place where, as teenagers, they battled an evil creature that preyed on the city’s children. Now, children are being murdered again and their repressed memories of that terrifying summer return as they prepare to once again battle the monster lurking in Derry’s sewers. Readers of Stephen King know that Derry, Maine, is a place with a deep, dark hold on the author. It reappears in many of his books, including Bag of Bones, Hearts in Atlantis, and 11/22/63. But it all starts with It. “Stephen King’s most mature work” (St. Petersburg Times), “It will overwhelm you…to be read in a well-lit room only” (Los Angeles Times).');