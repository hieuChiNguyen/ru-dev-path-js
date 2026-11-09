const redis = require('redis');
const bluebird = require('bluebird');

// Make all functions in 'redis' available as promisified
// versions whose names end in 'Async'.
bluebird.promisifyAll(redis);

// When using 'await', code needs to be in a function that
// is declared 'async', so our code is wrapped in here and
// called at the bottom of the script.
const runApplication = async () => {
  // Connect to Redis.
  const client = redis.createClient({
    host: 'localhost',
    port: 6379,
    // password: 'password',
  });

  // Run a Redis command.
  const reply = await client.setAsync('hello', 'world');
  console.log(reply); // OK

  const keyValue = await client.getAsync('hello');
  console.log(keyValue); // world

  // Clean up and allow the script to exit.
  client.quit();
};

try {
  runApplication();
} catch (e) {
  console.log(e);
}

// Ưu tiên async/await cho 95% nghiệp vụ tuần tự
// Khi tác vụ B bắt buộc phải đợi kết quả của tác vụ A để chạy tiếp (ví dụ: Lấy thông tin User từ Database ➡️ Có ID rồi mới tính điểm thưởng ➡️ Lưu cache vào Redis).

// Bắt buộc dùng Promise (Promise.all) khi xử lý song song (Concurrency)
// Đây là "cạm bẫy" lớn nhất của async/await. Giả sử bạn cần lấy thông tin cấu hình từ Redis, lấy danh sách bài viết từ DB, và gọi một API bên ngoài. Ba tác vụ này không liên quan đến nhau, không cái nào cần đợi cái nào.

// 1. Phân biệt nhanh
// Tiêu chí    Promise (.then() / .catch())                                      async / await
// Cú pháp     Nối chuỗi (Chaining). Code rẽ                                     Viết từ trên xuống dưới, trông hệt như code đồng bộ (Synchronous).
//             nhánh vào trong các callback.
// Bắt lỗi     Dùng .catch() ở cuối chuỗi.                                       Dùng khối try / catch nguyên thủy của JavaScript.
// Debug       Khó. Stack trace (lỗi) thường chỉ trỏ vào thư viện Promise,       Dễ. Trình gỡ lỗi (Debugger) nhảy từng dòng chính xác như code bình thường.
//             khó dò ra dòng code gốc.
// Phạm vi     Linh hoạt, ghép nối nhiều luồng phức tạp dễ dàng hơn.             Dễ bị "nghẽn" (block) nếu lạm dụng await cho các tác vụ không phụ thuộc nhau.
