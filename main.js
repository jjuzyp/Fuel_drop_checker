const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'wallets.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  if (!data.trim()) {
    console.log("Enter your wallet addresses into wallet.txt");
    return;
  }

  const wallets = data.trim().split('\n');
  let completedRequests = 0;
  let total = 0;
  const checkWallet = (wallet) => {
    fetch(`https://mainnet-14236c37.fuel.network/allocations?accounts=${wallet}`)
      .then(response => {
        if (!response.ok) {
            return { allocations: [] };
        }
        return response.json();
      })
      .then(data => {
        if (data.allocations.length > 0){
        ammount = Math.floor(data.allocations[0].amount / 10000000) / 100;
        console.log(`For wallet ${wallet} Total: ${ammount}`);
        total += ammount;
    }else {
        console.log(`No allocations found for wallet ${wallet}`);
    }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      })
      .finally(() => {
        completedRequests++; 
        if (completedRequests === wallets.length) {
          console.log('All', completedRequests, 'wallets have been checked with total of', total, 'tokens! Press enter to exit...');
          process.stdin.on('data', (data) => {
            process.exit(0);
          });
        }
      });
  };

  wallets.forEach((wallet, index) => {
    setTimeout(() => {
      checkWallet(wallet.trim());
    }, index * 1000);
  });
});