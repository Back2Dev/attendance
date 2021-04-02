// ip.js
// Script to look through the network interfaces and return a list of candidates
// 
'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var debug = false;

var ip = function() {
  var ret = [];
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        if (debug)  
          console.log(ifname + ':' + alias, iface.address);
        ret.push({ifname: ifname, address: iface.address})
      } else {
        // this interface has only one ipv4 adress
        if (debug)  
          console.log(ifname, iface.address);
        ret.push({ifname: ifname, address: iface.address})
      }
      ++alias;
    });
  });
  return ret;
}

module.exports = ip;