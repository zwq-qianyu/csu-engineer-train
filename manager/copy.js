const fs = require('fs');
const path = require('path');
// var files = [
// 'teacher-manage.html',
// 'student-manage.html',
// 'setup.html',
// 'extra-work.html',
// 'divide-group.html',
// 'course-schedul.html'
// ];


files.forEach(function(val,i){
    console.log(val)
    fs.copyFileSync(val,'rewrite-'+val)
});

