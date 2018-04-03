module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 7545,
               network_id: "*" // Match any network id
          },
          // For geth node connection w/Truffle
          chainskills: {
            host: "localhost",
            port: 8545,
            network_id: "4224",
            gas: 4700000
            // if you have to use another account to do transactions, ex: below
            //from: '0x1c52113dd983cda342a7724cb4370a228eec2690'
            // from 2nd acct
          },
          rinkeby: {
            host: "localhost",
            port: 8545,
            network_id: 4, //Rinkeby test network
            gas: 4700000
          }
     }
};
