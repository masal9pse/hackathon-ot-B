'use strict';

module.exports = function(socket, master) {
    // disconnect が発火したときに Manager をチェックする
    socket.on('disconnect', function() {
        console.log("##### disconnect #####");
    });
}
