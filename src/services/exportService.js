const ExcelJS = require("exceljs");

// const products = [
//   {
//     id: 1,
//     name: "sifi",
//     price: 1000,
//   },
//   {
//     id: 2,
//     name: "souris",
//     price: 400,
//   },
//   {
//     id: 3,
//     name: "clavier",
//     price: 2000,
//   },
//   {
//     id: 4,
//     name: "tapis souris",
//     price: 1500,
//   },
// ];

const exportExcel = async (products) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Sheet", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  worksheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Name", key: "name", width: 32 },
    { header: "Price", key: "price", width: 10, outlineLevel: 1 },
  ];

  products.forEach((product) => {
    worksheet.addRow({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  });

  // Specify a file path to writeFile() to save the Excel file
  await workbook.xlsx.writeFile("products.xlsx");

  return workbook;
};

module.exports = exportExcel;
