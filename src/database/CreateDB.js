//? >>> **Cách 1: Sử dụng File System (fs) module**

const fs = require('fs');

// Tạo một biến để lưu dữ liệu cần ghi
const data = 'Dữ liệu của bạn ở đây';

// Ghi dữ liệu vào file.txt
fs.writeFile('file.txt', data, (err) => {
  if (err) throw err;
  console.log('Dữ liệu đã được lưu vào file');
});


// **Cách 2: Sử dụng module bên thứ ba:**

// **fs-extra** là một module bên thứ ba cung cấp các hàm tiện ích bổ sung cho `fs` module gốc.

const fs = require('fs');
const fse = require('fs-extra');

// Tạo một biến để lưu dữ liệu cần ghi
const dataTwo = 'Dữ liệu của bạn ở đây';

// Ghi dữ liệu vào file.txt
fse.writeFile('file.txt', data, (err) => {
  if (err) throw err;
  console.log('Dữ liệu đã được lưu vào file');
});


// **Cách 3: Sử dụng Node.js streams**
const fs = require('fs');

// Tạo một biến để lưu dữ liệu cần ghi
const dataThree = 'Dữ liệu của bạn ở đây';

// Tạo một stream ghi cho file.txt
const writeStream = fs.createWriteStream('file.txt');

// Ghi dữ liệu vào stream
writeStream.write(data);

// Đóng stream để hoàn tất quá trình ghi
writeStream.end();

// Sự kiện 'finish' sẽ được kích hoạt khi quá trình ghi hoàn tất
writeStream.on('finish', () => {
  console.log('Dữ liệu đã được lưu vào file');
});