const referenceTable = [
  {
    days: ["MO", "TU", "WE", "TH", "FR"],
    hours: [
      {
        start: 0,
        end: 8,
        pricePerHour: 25,
      },
      {
        start: 9,
        end: 17,
        pricePerHour: 15,
      },
      {
        start: 18,
        end: 24,
        pricePerHour: 20,
      },
    ],
  },
  {
    days: ["SA", "SU"],
    hours: [
      {
        start: 0,
        end: 8,
        pricePerHour: 30,
      },
      {
        start: 9,
        end: 17,
        pricePerHour: 20,
      },
      {
        start: 18,
        end: 23,
        pricePerHour: 25,
      },
    ],
  },
];

async function getPayments() {
  try {
    const text = await readData();
    const formattedData = formatData(text);

    const list = document.getElementById("list-results");
    list.innerHTML = "";

    const messageElement = document.getElementById("error-message");
    messageElement.innerHTML = "";

    formattedData.map((workerSchedule) => {
      const totalPayment = getWorkerPayment(workerSchedule.schedule);
      const text = `The amount to pay to ${workerSchedule.name} is: $${totalPayment} USD`;

      let liElement = document.createElement("li");
      liElement.appendChild(document.createTextNode(text));
      list.appendChild(liElement);
    });
  } catch (err) {
    const messageElement = document.getElementById("error-message");
    messageElement.innerHTML = "";
    messageElement.appendChild(document.createTextNode(err.message));

    const list = document.getElementById("list-results");
    list.innerHTML = "";

    let file = document.getElementById("fileUpload");
    file.value = null;
  }
}

async function readData() {
  try {
    let file = document.getElementById("fileUpload").files[0];
    const text = await file.text();
    return text;
  } catch (err) {
    throw new Error("Error reading the file");
  }
}

const formatData = (rawData) => {
  try {
    const workersList = rawData.split("\r\n");

    const workers = workersList.map((element) => {
      const value = element.split("=");
      const name = value[0];

      const schedule = value[1].split(",").map((day) => {
        let dayInitials = day.slice(0, 2);
        let [start, end] = day.substring(2).split("-");

        return {
          dayInitials,
          start: start.split(":")[0],
          end: end.split(":")[0],
        };
      });

      return {
        name,
        schedule,
      };
    });

    return workers;
  } catch (err) {
    throw new Error(
      "Error reading text contents, review the correct format is used Name=DDHH:MM-HH:MM,DDHH:MM-HH:MM"
    );
  }
};

const getWorkerPayment = (workerSchedule) => {
  try {
    let total = 0;
    workerSchedule.map((day) => {
      referenceTable.map((tableRow) => {
        if (tableRow.days.includes(day.dayInitials)) {
          const paymentPerDay = getDayPayment(tableRow.hours, day);
          total += paymentPerDay;
        }
      });
    });
    return total;
  } catch (err) {
    throw new Error("Error calculating payment, review hours");
  }
};

const getDayPayment = (hoursRef, workerHours) => {
  try {
    let startRange, endRange;
    let startInt = parseInt(workerHours.start);
    let endInt = parseInt(workerHours.end);
    for (let i = 0; i < hoursRef.length; i++) {
      if (hoursRef[i].start <= startInt && startInt <= hoursRef[i].end)
        startRange = i;
      if (hoursRef[i].start <= endInt && endInt <= hoursRef[i].end)
        endRange = i;
    }

    if (startRange === endRange) {
      return (endInt - startInt) * hoursRef[startRange].pricePerHour;
    }
    if (endRange - startRange === 1) {
      let pay1 =
        (hoursRef[startRange].end + 1 - startInt) *
        hoursRef[startRange].pricePerHour;
      let pay2 =
        (endInt - hoursRef[endRange].start) * hoursRef[endRange].pricePerHour;

      return pay1 + pay2;
    }
    if (endRange - startRange === 2) {
      let pay1 =
        (hoursRef[startRange].end + 1 - startInt) *
        hoursRef[startRange].pricePerHour;
      let pay2 =
        (endInt - hoursRef[endRange].start) * hoursRef[endRange].pricePerHour;
      let pay3 =
        (hoursRef[1].end - hoursRef[1].start) * hoursRef[1].pricePerHour;
      return pay1 + pay2 + pay3;
    }
  } catch (err) {
    throw new Error("Error calculating payment, review hours");
  }
};
