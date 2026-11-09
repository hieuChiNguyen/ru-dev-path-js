const redis = require('redis');

const connectWithPortAndHost = () => {
  // Connect with port and host.
  const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
  });

  // Send PING command expect PONG response.
  client.ping((err, response) => console.log(response));
  client.quit();
};

const connectToDefaultPortAndHost = () => {
  // Connect to default port (6379) and host (127.0.0.1)
  const client = redis.createClient();

  // Send PING command expect PONG response.
  client.ping((err, response) => console.log(response));
  client.quit();
};

const connectUsingURL = () => {
  // Connect using a URL format.
  const client = redis.createClient({
    url: 'redis://127.0.0.1:6379',
  });

  // Send PING command expect PONG response.
  client.ping((err, response) => console.log(response));
  client.quit();
};

const connectWithPassword = () => {
  // Connect and provide a password.
  const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    password: 'secretPassword',
  });

  // Send PING command expect PONG response.
  client.ping((err, response) => console.log(response));
  client.quit();
};

const connectWithSSL = () => {
  const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    tls: {
      key: 'contents of key file',
      cert: 'contents of cert file',
      ca: ['contents of ca cert file'],
    },
  });

  // Send PING command expect PONG response.
  client.ping((err, response) => console.log(response));
  client.quit();
};

connectWithPortAndHost();
connectToDefaultPortAndHost();
connectUsingURL();
// connectWithPassword();
// connectWithSSL();

// Trong các hệ thống thực tế, connectWithSSL (hay kết nối qua TLS/SSL) đóng vai trò thiết lập một "đường hầm" mã hóa giữa ứng dụng Node.js và máy chủ (như Redis, PostgreSQL, v.v.). Điều này đảm bảo toàn bộ dữ liệu truyền đi (như mật khẩu, dữ liệu người dùng) không bị đọc trộm (sniffing) hoặc thay đổi giữa chừng (Man-in-the-Middle attack).

// Để connectWithSSL hoạt động, hệ thống yêu cầu 3 thành phần cốt lõi (tương ứng với 3 tham số bị lỗi trong code của bạn):

// + ca (Certificate Authority): Chứng chỉ của tổ chức phát hành (hoặc chứng chỉ gốc nội bộ do công ty tự tạo). Ứng dụng Node.js dùng file này để xác minh xem máy chủ Redis nó đang kết nối tới có phải là "hàng thật" hay không.
// + cert (Client Certificate): Chứng chỉ định danh công khai của chính ứng dụng Node.js.
// + key (Private Key): Khóa bí mật của ứng dụng Node.js, đi cặp với cert. Khóa này dùng để giải mã dữ liệu và chứng minh Node.js là chủ sở hữu hợp pháp của chứng chỉ.

// Quy trình hoạt động (TLS Handshake & mTLS):

// + Xác thực Server (Một chiều): Node.js gửi yêu cầu kết nối tới Redis. Redis phản hồi bằng chứng chỉ của nó. Node.js dùng file ca để kiểm tra xem chứng chỉ của Redis có hợp lệ không.
// + Xác thực Client (Hai chiều - Mutual TLS/mTLS): Nếu Redis được cấu hình bảo mật nghiêm ngặt, nó sẽ yêu cầu Node.js phải chứng minh danh tính. Lúc này Node.js sẽ gửi cert của nó lên, và dùng key để ký xác nhận.
// + Mã hóa dữ liệu: Sau khi cả hai bên tin tưởng nhau, một khóa mã hóa phiên (session key) được tạo ra. Từ lúc này, mọi lệnh như SET hello world đều được mã hóa thành các chuỗi ký tự vô nghĩa trước khi đi qua mạng lưới cáp internet.
