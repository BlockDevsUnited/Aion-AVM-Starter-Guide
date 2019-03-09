# Aion-Java-Starter-Guide

This Tutorial shows you step by step how to create a front end Dapp that interacts with the Aion kernel that uses the new Aion Virtual Machine (AVM)

*We will refer to AVM as the Aion Kernel that runs the Java-based contracts*

## Java Contract Support (AVM)
AVM is a lightweight version of the JVM, the compiler for Java code. Security enhacements have been incorporated to prepare it for an adversarial blockchain environment. In this tutorial we will be able to deploy Java programs as smart contracts and interact with it from the test network.

The three parts to this tutorial are:

1. Create a basic HTML and javascript front end
2. Create and Deploy a java smart contract on the AVM testnet with the Maven Build tool
3. Connect the front end and smart contract together using web3 and the Aiwa browser extension.


# Quick Start

- Install Prereqs https://docs.aion.network/docs/maven-and-aion4j-installation#section-windows
- Install Aiwa Chrome extension
- Obtain an Endpoint from nodesmith.io. Should look something like this: https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=333be7bc8dcf4068807ba4c3c5209942
- replace mainnet with avmtestnet in the nodesmith endpoint URL to connect to the AVM testnet. 
- Connect Aiwa to the AVM network, by selecting Custom [network], and input your nodesmith endpoint, with Port 443
- Get AVM testnet AION from https://faucets.blockxlabs.com/
- turn off Metamask extension
- Clone this tutorial
 `git clone https://github.com/BlockDevsUnited/Aion-AVM-Starter-Guide.git`
- cd to Example-Dapp
- open index.html to view the website
- replace account address and account private key with your address and private key in index.js
- try the buttons!
- inspect the console to see the results!

# Step By Step Guide

## Create an HTML frontend

(For a quickstart, you can copy the HTML project sample from this repo)

- Open a code editor. Atom or VsCode will work fine.
- create basic html page called index.html
- Open html and body tags
```
<html>
<body>
</body>
</html>
```
- Inside the body, Create a page with Greet, setString, and getString buttons, and a text input
``` <body>
<input type="text" id="streetToGreet"></input> <button onclick="greet()">Greet</button><br>
<input type="text" id="stringToSet"></input> <button onclick="setString()">set string</button> <br>
<button onclick="getString()">get string</button>
</body>
```
- navigate to the directory and double-click index.html to open in the browser

- That's it, you're done!

## Deploy a smart contract with Maven
Aion4j Maven Plugin provides end to end development support for AVM based smart contract in java.

Here you will:
- Install Maven
 https://docs.aion.network/docs/maven-and-aion4j
- Install Maven's AVM archtype
 https://github.com/satran004/avm-archetype
 https://github.com/satran004/aion4j-maven-plugin/wiki/Aion4j-Maven-Plugin---User-Guide
- Create Maven project
- Point it to AVM testnet
- edit smart contract
- create new address, get AVM Testnet Aion
- Deploy contract
- Get Contract Address
         

---

### Pre-requisites
1. Java 10 and above
2. Maven 3.5.4 and above

<!--<a name="setup_build"></a>-->

### 1. Build Maven (Windows users only need this extra step for the avm.jar file)
Maven is a build tool that will help us deploy Java programs to AVM blockchain.
```
git clone https://github.com/satran004/aion4j-maven-plugin.git
```

Install avm.jar to local .m2 repo for compilation
``` 
./mvnw initialize
```

Compile the plugin
``` 
./mvnw clean install -DskipITs
```
Run integration tests
``` 
./mvnw integration-test
```

copy your avm.jar file into your lib folder of your project in the next step to avoid mvn initialize error.

### 2. Create AVM java project
The fastest way to create a AVM project is using a maven archetype - [avm-archetype](https://github.com/satran004/avm-archetype).
Archetype is a Maven project templating toolkit. This is an existing Java tool. An archetype is defined as an original pattern or model from which all other things of the same kind are made. 

Run the following maven command to create an AVM project.

```
$> mvn archetype:generate -DarchetypeGroupId=org.aion4j -DarchetypeArtifactId=avm-archetype -DarchetypeVersion=0.5
```
Follow the instruction to enter groupId, artifactId and package information to generate the project. (You can put in anything, I suggest you use strings ie. "foo", "bar", etc. as it may have a tendency to confuse numbers for other commands)

The generated project has a sample HelloAVM contract.


---

### Debugger 
If you want to try the debugger feature, install IntelliJ: https://www.jetbrains.com/idea/download/#section=mac
File -> Open and choose created project directory

#### Test your contract using the debugger tool

The sample project downloaded from the Archetype comes with a sample test.

1. Set your debug points

2. Run the tests

---

### 3. Edit pom.xml

Edit pom.xml file in the generated project and change &lt;aion4j.maven.plugin&gt; version to the latest release version. Please refer to [aion4j maven plugin](https://github.com/satran004/aion4j-maven-plugin) project page for the latest release version.

```
<properties>
  ...
   <aion4j.plugin.version>0.4.5</aion4j.plugin.version>
  ...
</properties>
```


---


**Contract Main-class**:

Verify contract's main class is same as entry in **contract.main.class** property in pom.xml's plugin section. This is done automatically so you won't have to change anything.

```
<contract.main.class>org.test.HelloAvm</contract.main.class>
```

**Class-Verifier for whitelist classes**

To enable class-verifier goal which verifies usage of allowed apis in the contract, you need to make sure that "class-verifier" goal is uncommented in pom.xml. This goal is executed during compile phase of maven build cycle.

```
<goal>class-verifier</goal>
```

---

### 4. Initialize and copy required AVM libraries
By default, the plugin will copy required avm jars to the lib folder under the project directory. But you can also point to a different avm lib folder by changing "avmLibDir" property in aion4j plugin configuration in pom.xml if you want to use a different version of AVM. But for now, let's use the default avm version bundled in the plugin.

```
$> mvn initialize
```

---

### 5. Build the project

```
$> mvn clean install
```
**Note:** During build, the plugin checks for apis which are not allowed in the java smart contract and shows the error accordingly.

<a name="using_embedded"></a>

### 6. Include a custom smart contract

Navigate to the smart contract in the Maven Project, under src/main/java. Replace the existing java contract with the following code:
```

package example-contract;

import org.aion.avm.api.ABIDecoder;
import org.aion.avm.api.BlockchainRuntime;

public class HelloAvm
{

    public static String storage1;

    public static void sayHello() {
        BlockchainRuntime.println("Hello Avm");
    }

    public static String greet(String name) {
        return "Hello " + name + "!";
    }

    public static void setString(String stringToStore) {
        storage1 = stringToStore;

    }

    public static String getString() {
        return storage1;
    }  
    
    //main should be last function
    public static byte[] main() {
        return ABIDecoder.decodeAndRunWithClass(HelloAvm.class, BlockchainRuntime.getData());
    }
}


```
This new contract has additional setString and getString functions that can get and set values to the AVM testnet.

To compile your changes:

```
$> mvn initialize
$> mvn clean install

```

## Using Embedded AVM

---

### 1. Deploy your first AVM smart contract in an embedded AVM

```
$> mvn aion4j:deploy
```
**Note:** The deployer address is taken from the "&lt;localDefaultAddress&gt;" property in the plugin configuration section in pom.xml

To make the deployment process easier, by default, the plugin creates an account for the deployer if it is not there and allocate some balance to it.


---

### 2. Call a method in the smart contract
The archetype generated project comes with a sample java smart contract. To invoke "greet" method in the sample contract, run the aion4j:call maven goal.

```
$> mvn aion4j:call -Dmethod=greet -Dargs="-T AVM"
```
The output should be something similar:

[INFO] ****************  Method call result  ****************

[INFO] Data       : Hello AVM

[INFO] Energy used: 66414

[INFO] *********************************************************

---

The aion4j:call goal syntax is as below:

```
$> mvn aion4j:call -Dmethod=<method_name> -Dargs="<arg_type> <arg_value> <arg_type> <arg_value> ..."
```
**Note:** You can also optionally pass -Daddress=<address> if you don't want to use the "localDefaultAddress" mentioned in the plugin configuration in pom.xml.

The supported arg_types are

```
-I int
-J long
-S short
-C char
-F float
-D double
-B byte
-Z boolean
-A Address
-T String
```

---

### 3. Get the balance
To get the balance of the default address.

```
$> mvn aion4j:get-balance
```
You can pass -Daddress property to get balance of another account.
Example:
```
$> mvn aion4j:get-balance -Daddress=<address>
```
---

### 4. To create a new account with balance
This creates the specified account in storage with the provided balance for testing.
```
$> mvn aion4j:create-account -Daddress=a0xxxxx -Dbalance=<value>
```

<a name="using_remote"></a>

---

## Using Aion Kernel (AVM Testnet)
For remote deployment support, there is a separate &lt;profile&gt; section in the pom.xml with profile id "remote". So to trigger aion4j goals for remote Aion kernel, you need to pass "-Premote"  in the maven command.


Alternatively, you can change the "mode" property in the plugin configuration (pom.xml) to "remote" to enable remote deployment by default.

---

#### Web3 Rpc Url

The new AVM testnet is called *avm-testnet* (not Mastery, which is our previous version using a Eth fork called FVM) and we will use tokens from this network, and deploy our contract to this network
to reach the avm testnet, use nodesmith https://dashboard.nodesmith.io
and change the "mainnet" portion of the url to "avmtestnet"


![Alt text](./img/nodesmith.png?raw=true "Title")

For more info on nodesmith, check out Aion docs: https://learn.aion.network/docs/nodesmith

Edit your pom.xml with the new remote endpoint. Profiles section is at the end of the pom file, not to be confused with local configuration under build/plugins/plugin.

```
<profiles>
 <profile>
  <id>remote</id>
  <build>
    <plugins>
      <plugin>
        ...
        <configuration>
           <mode>remote</mode>
           <avmLibDir>${avm.lib.dir}</avmLibDir>
           <web3rpcUrl>https://api.nodesmith.io/v1/aion/avmtestnet/jsonrpc?apiKey=xxxxxxxxxxxxxx</web3rpcUrl>
        </configuration>
        ...
```

---

### 1. Create account

#### Install AIWA
Download and install the Aiwa browser extension. Available on Chrome.

https://chrome.google.com/webstore/detail/aiwa/objigohafkcoodmofgmifblmfidicehc?hl=en

It will ask you to save a password and a seed phrase. This is a two-step authentication. 
A wallet is a type of public key. Blockchain uses public/private key cryptography to keep your account safe. Your private key is your seed phrase and your claim to any tokens associated to your wallet public key. **Never give out your private key or upload to github etc.**


#### connect AIWA to AVM Testnet
Go to the network connection setting (dropdown where is says Mainnet or Mastery) and connect to our nodesmith endpoint we created custom for the tutorial.

Now your wallet is connected to the AVM testnet.

more info here: https://blog.aion.network/java-smart-contracts-hit-the-testnet-ef0b8810f26e


#### Copy your wallet address

Wallet address is your account we will use to fund transactions and deployment of programs. Each interaction with the blockchain network costs energy (gas) and we will need an account to provide funds.

All aion addresses start with "0xa" so you will know this is correct

---

### 2. Fund Account

We have to fund the account with testnet tokens.
You can fund with AIWA wallet extension (Metamask for Aion).
TAs will help you send tokens to your wallet address.

Send 1-2 tokens to your address from previous step.
Each transaction costs approx. 0.3 Aion.

Faucet instructions:
https://faucets.blockxlabs.com/
1. select Aion 
2. in network dropdown select avm-testnet
3. enter your address to fund. You can fund the address you created in previous step in your AIWA.

It will send you 1 testnet Aion in about 30 seconds


![Alt text](./img/faucet.png?raw=true "Title")

Aion docs will provide more information here: https://learn.aion.network/docs/faucet-get-your-testnet-aion-coins

---

### 3. Deploy your Java Program to the testnet

Check that everything is working and accurate

```
$> mvn aion4j:get-balance -Daddress={your address here} -Premote
```
Use the same deploy command but add the `-Premote` command

#### Deploy method 1: Set your environment variables

Recommended for the rest of this tutorial

On Mac and Linux:
```
export pk=YOURPRIVATEKEY
export web3rpc_url=YOURNODESMITHENDPOINT
```
On Windows:
```
set pk=YOURPRIVATEKEY
set web3rpc_url=YOURNODESMITHENDPOINT
```
Now we won't specify the address anymore (private key) or the remote url endpoint. Maven will also store other important info for you, as we will see. 

You're ready to deploy the contract:
```
$> mvn aion4j:deploy -Premote
```

#### Deploy method 2: Without setting environment variables
If you didn't set your environment variables:
```
$> mvn aion4j:deploy -Dweb3rpc.url=YOURNODESMITHENDPOINT -Dpk=YOURPRIVATEKEY -Premote
```
and it will return you a tx hash, you can inspect but Maven will store your last transction has for you.

#### What happens when you deploy a Java Program to AVM?
The peer-to-peer network shares compatible versions of the same Aion kernel. That includes the AVM, and the ledger history (and a transaction pool for mining peers). The AVM allows us to execute Java programs. The kernel from your local machine will generate an address for your program called a "contract address" that is also given some memory space or storage. In our contract that includes our function methods (greet, getString, setString) and fields (String storage1). 
This is broadcast to other peers in the network, and will be queued for the next block in their transaction pool. It is a request to add this program to the collective network memory. Once the transaction is successfully added to a block, it is broadcast as valid to the whole network. Now anyone can call this program from any of its copies in any peer of the network.
A similar transaction flow happens when you want to update the string field in the program. Since it is stored in the now public program, changes made to the field are also public and need to be validated by everyone.

---

### 4. Get transaction receipt
Use the transaction hash from the above step to get the details.

```
$> mvn aion4j:get-receipt -DtxHash=<tx_hash> -Premote
```

You should see a json output.
A transaction gets queued to be validated into the next block. This usually takes 10-30 seconds. A transaction receipt that returns "null" will tell you that it has not been committed to the ledger yet. If it completes, you will get more info, including the contract address of your program.

Wait and get the transaction receipt.
Maven will remember your contract address, assuming you only have one. You should save the contract address anyway for when we connect to the contract from our web app.

*Save your contract address*

---

### 5. Call contract method: "greet"
This goal makes a web3 rpc call for "eth_call" function to remote kernel. Maven remembers your last contract address
Specify your method ("greet", "setString" or "getString") and your arguments, if any.

```
$> mvn aion4j:call -Dmethod=greet -Dargs="-T 'AVMTestnet'" -Premote
```
*note: sometimes quotation marks in the wrong format will give you an error. The most accurate way is to manually type quotation marks in the command line*

You will get a response that says "Hello ..'your string'"

---

### 6. Send contract transaction: "setString"
This goal makes a web3 rpc call for "eth_sendTransaction" function to remote kernel

```
$> mvn aion4j:contract-txn -Dmethod=setString -Dargs="-T 'My First String'" -Premote
```

Any transaction that updates the ledger state will take 10-30 seconds. Use the `get-receipt` method to check your transactions are complete before proceeding to the next step, or you will get a error if your transaction is incomplete.

Also periodically check if you have enough funds in your account. 

---

### Appendix: To transfer from one address to another

```
$> mvn aion4j:transfer -Dto=a0xxxxxx -Dvalue=<amount> -Premote
```

---

## Connect Front End with Smart Contract

- Add web3 source to front end
- Point your app to avm testnet and your contract
- transaction functions
- connect buttons to functions
- test the Dapp!

---

### 2. Connect Aiwa to AVM testnet

Use the nodesmith URL used in the remote rpc step

---

### 3. Add Web3 to frontend

The beta version of web3 for avm is avilable at the aion repository below. 
(note: aionweb3 injected from AIWA will not have the avm module at the time of writing)
In index.html file, add  `<script type="text/javascript" src="./web3.min.js"></script>`
include web3.min.js in your dApp directory.
get the file here https://github.com/aion-kelvin/AvmFuntime/blob/master/myhack/web3.min.js

Note: Turn off your metamask extension if you have one because it can override the Aion web3

---

### 4. Set up a javascript file.

Create a file called index.js in the same folder as index.html.

Include index.js in index.HTML   `<script type="text/javascript" src="./index.js"></script>`

Declare your Web3 object `let web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/avmtestnet/jsonrpc?apiKey=xxxxxxxxxxxxxx"));`

create variables for the contract address, your address and your private key.

```
let contractAddress = "<address of the contract you deployed on Maven>";
let accountAddress = "<your aiwa address>";
let accountPK = "<your aiwa private key>";

```
---

### 5. Implement Javascript functions

Create a function to send a transaction to the contract we deployed previously. 
We use the avm methods of web3 to interact with the contract.
We will pass the method name (greet, setString, or getString), the argument type as "String" and the argument.
All our arguments are encoded to hex format, then decoded from hex 

Web3 is an interface for javascript to communicate with the blockchain network, as we did with Maven on the command line. 

#### To summarize, there are two types of invocations:
1. Transaction
2. Call

Transaction is anything that will update (write) the state of the ledger on the blockchain. Setting a string will change the string stored on our address space. The string is saved forever and for everyone to see, unless it is explicitly changed. This is the more intensive and expensive type of invocation, because changing the state means updating a new block, and waiting for everyone to validate and agree on it.

A Call is anything that is read-only and doesn't update the state. We don't have to wait for the transaction to complete.

Other than these two differences, a call and transaction are the same.

#### Javascript Web3 Transaction Steps
In a nutshell,
1. Specify our contract call - what method and arguments to compute
2. Prepare the transaction object
3. Sign Transaction with our private key for security
4. Send final Signed Transaction
5. After transaction completes, we do a call (read-only)

```
function sendTransaction(methodName, argType, arg) {

  var stringToGreet = document.getElementById("stringToGreet").value;

    // 1. Specify our contract call - what method and arguments to compute
    console.log(web3);
  let method, data;
    if (argType) {
      method = web3.avm.method(methodName).argTypes(argType);
      data = method.encodeToHex(arg);
    } else {
    // currently passing null blank string is not supported for sending no argTypes or data, this is the only way:
      method = web3.avm.method(methodName).argTypes();
      data = method.encodeToHex();
    }
 
    // 2. Prepare the transaction object
    let txObject = {
        from: accountAddress, 
        to: contractAddress,
        gas: 2000000, // this is max amount
        data: data,
        type: '0xf' 
    };

    // 3. Sign Transaction with our private key for security
    let signTxObject;

    web3.eth.accounts.signTransaction( 
        txObject, accountPK
    ).then(function(res) {
        signedTxObject = res;

    // 4. Send final Signed Transaction
        web3.eth.sendSignedTransaction(
          signedTxObject.rawTransaction
        ).on('transactionHash', txHash => {
          console.log("txHash", txHash) // Print txHash
          
        }).on('receipt',
          receipt => { 
            console.log("tx receipt", receipt) 
            getValueOnComplete() //see below
          } // Print txReceipt

        );
    });
    function getValueOnComplete() {
    
    // 5. After transaction completes, we do a call (read-only)
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
```

---

Create different methods to call transactions based on what the user wants to send 
This is purely javascript logic, nothing new from blockchain.

```
function greet ()  {
  var greetString = document.getElementById("stringToGreet").value;
  sendTransaction("greet", "String", greetString) 
}

function setString() {
  var setString = document.getElementById("stringToSet").value;
  sendTransaction("setString", "String", setString) 
}

function getString() {
  sendTransaction("getString", null , null) 
}
```
---

### 6. connect buttons to functions
in index.html, add function calls to the buttons, like so

<button onclick="greet()">Greet</button>
<button onclick="setString()">set string</button>
<button onclick="getString()">get string</button>


Again, purely HTML and Javascript, nothing new from blockchain.
Try it out by right clicking to open your developer console.
For the full web app code, try the sample project in this repo.

---

### 7. test the dApp
`Serve the Dapp using python -m SimpleHTTPServer`
Or simply open the file index.html from your file explorer

