# ACME EXERCISE

### Description

This program will solve the problem posted by IOET on payment calculation according to hours worked

## Solution

### Customer Requirements

All the requirements are described on the email

### Algorithm

1. Start the software
2. Upload the file
3. If file format is correct continue, if not, return to step number 2
4. Confirm the calculation
5. Read the file, if everything is okay, continue, if not, return to step number 2
6. Map for every line the name, and data
7. Get for each day the amount of hours worked, using the table provided
8. Add all the day amounts for each worker
9. Display the results
10. If want to calculate other, return to step 2, if not, finish

![Flowchart](https://user-images.githubusercontent.com/80548918/215859412-92d19670-a3c8-4f1a-8823-1c6773a6cffc.png)

### Technologies to use

Because the software requirements are not that complex, and it should be able to run without any installation or use of package manager, it was decided to use HTML5 for the DOM, CSS3 for styling and Vanilla JavaScript so it can run on any modern browser. Because on the requirements it was explicitly said that the use of external libraries is not allowed, so CSS Frameworks such as bootstrap or JS libraries as JQuery won't be used. As said before, because the software requeriments are not complex, typical JS architecture will be used, where UI is placed at the center of the development.

## Installation and Usage

Download/Clone the files on the repository, and then open the index.html file with preferred browser.

Upload your .txt file on the format NAME=DDHH:MM-HH:MM,DDHH:MM-HH:MM, or you can use the sample file on the repository.

https://user-images.githubusercontent.com/80548918/215854305-74b1532f-92ea-4ede-bb10-6c26fcb0471d.mp4

### Testing

Because external libraries/frameworks is not allowed, it was decided to create own tests, doing something similar of what Jest does, this tests were added on ./scripts file, and run when the file is opened, this is done for not to create modules and make more complex the software. There was unit testing about the functions used, and about the page render as well.
