const express = require('express');
//engin handlebar view
const hbs = require ('hbs');
const fs = require('fs');
//Lấy biến muôi trường trên server máy chủ, còn trong máy local thì không lấy
//mà lấy 3000
const port = process.env.PORT || 3000;
var app = express();

//partialsv sử dụng để tách từng phần file hbs để thêm vào file hbs khác 
//giống như thêm biến. 
hbs.registerPartials(__dirname + '/views/partials');
//cài đặt view engin cho express
app.set('view engin','hbs');



//app use xử lý tất cả các request, phải có next để chuyển 
//sang các xử lý khác khớp với request
//Hàm bên dưới ghi nhận mọi request rồi lưu lại, bao gồm ngày tháng
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`
	console.log(log);
	//Ghi vào nội dung log vào file log
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	});
	next();
});

//Tạo trang bảo trì
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

//thứ tự rất quan trọng với express, đặt thư mục tĩnh phí sau phản hồi bảo trì
//tránh trường hợp vào được các trang tĩnh (mặc dù web đang bảo trì)
app.use(express.static(__dirname + '/public'));

//Tạo hàm trả về giá trị trong html
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

//Tạo hàm trả giúp đổi text trong html thành viết hoa
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	res.render('home.hbs',{
		pageTitle: 'Home page',
		wellcomeMessage: 'Wellcome to my Website',
		
	});
	
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page',
		
	});
});

//Tao thong bao loi khi truy cap vao /bad
//
app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to handle request'});
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});