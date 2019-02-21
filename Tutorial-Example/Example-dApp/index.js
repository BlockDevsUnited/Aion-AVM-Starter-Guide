
// const aionweb3 = require("aion-web3");
let web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/avmtestnet/jsonrpc?apiKey="));
let contractAddress = "";
let accountAddress = "";
//
let accountPK = ""

function sendTransaction(methodName, argType, arg) {

  var stringToGreet = document.getElementById("stringToGreet").value;

    // 1. Contract method definition
    console.log(web3);
  let method, data;
    if (argType) {
      method = web3.avm.method(methodName).argTypes(argType);
      data = method.encodeToHex(arg);
    } else {
      method = web3.avm.method(methodName).argTypes();
      data = method.encodeToHex();
    }
 

    // 2. Create the transaction object
    let txObject = {
        from: accountAddress, // your account address
        to: contractAddress,
        gas: 2000000,
        data: data,
        type: '0xf'
    };

    // 3. Sign Transaction
    let signTxObject;

    web3.eth.accounts.signTransaction( // Signing function
        txObject, accountPK
    ).then(function(res) {
        signedTxObject = res;

        // 4. Send Signed Transaction
        web3.eth.sendSignedTransaction(
          signedTxObject.rawTransaction
        ).on('transactionHash', txHash => {
          console.log("txHash", txHash) // Print txHash
          
        }).on('receipt',
          receipt => { 
            console.log("tx receipt", receipt) 
            getValueOnComplete()
          } // Print txReceipt

        );
    });
    function getValueOnComplete() {
        var result = web3.eth.call({
            to: contractAddress, // contract address
            data: data
        });

        result.then(function(value){
          value = web3.avm.decodeOneObjectFromHex(value);

          console.log(value);
        })
    }

}

function greet ()  {
  var greetString = document.getElementById("stringToGreet").value;
  sendTransaction("greet", "String", greetString) 
}

function setString() {
  var setString = document.getElementById("stringToSet").value;
  sendTransaction("setString", "String", setString) 

}

function getString() {
  sendTransaction("getString") 
}