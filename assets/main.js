const gsheetId = "101hZNe_eWqZZMl48IID8KVkL-6PgMV_7L3PaWw4-jME";
const jsonUrl = `https://docs.google.com/spreadsheets/d/${gsheetId}/gviz/tq`;

// Fetch data from Google Sheets
fetch(jsonUrl)
  .then((response) => response.text())
  .then((text) => {
    const json = JSON.parse(text.substr(47).slice(0, -2));
    // console.log(json);

    const table = document.getElementById("sheet");

    // Helper function to create a cell
    const createCell = (content, className, role = "cell") => {
      const cellElement = document.createElement("span");
      cellElement.setAttribute("role", role);
      cellElement.classList.add(className);
      cellElement.innerHTML = content;
      return cellElement;
    };

    // Helper function to format time
    const createTimeString = (timeValue) => {
      const timeMatch = timeValue.match(
        /Date\(\d+,\d+,\d+,(\d+),(\d+),(\d+)\)/
      );
      return timeMatch
        ? new Date(1970, 0, 1, timeMatch[1], timeMatch[2], timeMatch[3])
            .toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })
            .replace(":00 ", "")
            .replace(" ", "")
        : "";
    };

    // Process each row in the JSON data
    json.table.rows.forEach((row) => {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");
      rowElement.setAttribute("role", "row");

      // Date and Time
      const dateValue = new Date(row.c[0].f);
      const options = { year: "numeric", month: "short", day: "numeric" };
      const dateFormatted = dateValue.toLocaleDateString("en-US", options);
      const startTimeFormatted = row.c[1] ? createTimeString(row.c[1].v) : "";
      const endTimeFormatted = row.c[2] ? createTimeString(row.c[2].v) : "";
      rowElement.appendChild(
        createCell(
          `${dateFormatted}<br>${startTimeFormatted}–${endTimeFormatted}`,
          "date"
        )
      );

      // Name
      const nameContent =
        row.c[4] && row.c[4].v
          ? `<a href="${row.c[4].v}">${
              row.c[3] && row.c[3].v ? row.c[3].v : ""
            }</a>`
          : row.c[3] && row.c[3].v
          ? row.c[3].v
          : "";
      rowElement.appendChild(createCell(nameContent, "name"));

      // Topic
      rowElement.appendChild(
        createCell(row.c[5] && row.c[5].v ? row.c[5].v : "", "topic")
      );

      // Attend
      const attendContent =
        row.c[7] && row.c[7].v
          ? `<a href="${row.c[7].v}">${
              row.c[6] && row.c[6].v ? row.c[6].v : ""
            }</a>`
          : row.c[6] && row.c[6].v
          ? row.c[6].v
          : "";
      rowElement.appendChild(createCell(attendContent, "url"));

      // Format
      const icon = { Talk: "☁︎", Workshop: "✒︎", "Field trip": "☻" };
      const formatValue = row.c[8] && row.c[8].v ? row.c[8].v : "";
      rowElement.appendChild(
        createCell(icon[formatValue] ? icon[formatValue] : "", "format")
      );

      // CD Only
      rowElement.appendChild(
        createCell(row.c[9] && row.c[9].v == "Yes" ? "✔︎" : "", "cdevent")
      );

      // Sponsor
      const sponsorContent =
        row.c[11] && row.c[11].v
          ? `<a href="mailto:${row.c[11].v}">${
              row.c[10] && row.c[10].v ? row.c[10].v : ""
            }</a>`
          : row.c[10] && row.c[10].v
          ? row.c[10].v
          : "";
      rowElement.appendChild(createCell(sponsorContent, "sponsor"));

      table.appendChild(rowElement);
    });
  })
  .catch((error) => console.error("Error fetching the JSON file:", error));
