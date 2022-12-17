const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
  
  describe("RectangleCrowdsale", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployRectangleCrowdsaleFixture() {
      // Contracts are deployed using the first signer/account by default
      const [deployer, otherAccount] = await ethers.getSigners();
      const rectangleTokenContractFactort =  await ethers.getContractFactory("RectangleToken"); // await ethers.getContractAt("RectangleToken", rectangleToken.address)
      const RectangleCrowdsale = await ethers.getContractFactory("RectangleCrowdsale");
      const rectangleTokenContract = await rectangleTokenContractFactort.deploy();
      const decimals = rectangleTokenContract.decimals();   
      const maxLimitPerAccount =  100000;
      const rectangleCrowdsale = await RectangleCrowdsale.deploy(decimals, rectangleTokenContract.address, deployer.address, maxLimitPerAccount);
      const totalSupply = await rectangleTokenContract.totalSupply();
      const approvedSupply = (totalSupply.mul(3)).div(4);
      const approveTx = await rectangleTokenContract.approve(rectangleCrowdsale.address, approvedSupply)
      await approveTx.wait(1);
      return { rectangleTokenContract, rectangleCrowdsale, maxLimitPerAccount, deployer, otherAccount, approvedSupply};
    }
  
    describe("RectangleCrowdsale", function () {
      it("Should get the correct allowance", async function () {
        const {rectangleCrowdsale, rectangleTokenContract, deployer, approvedSupply} = await loadFixture(deployRectangleCrowdsaleFixture);
        const allowance = await rectangleTokenContract.allowance(deployer.address, rectangleCrowdsale.address)
        const _approvedSupply = await rectangleCrowdsale.getAllowance();
        expect(allowance).to.equal(approvedSupply);
        expect(_approvedSupply).to.equal(approvedSupply);
      });

      it("Should be able to get token owner", async function () {
        const {rectangleCrowdsale, deployer} = await loadFixture(deployRectangleCrowdsaleFixture);
        expect(await rectangleCrowdsale.tokenOwner()).to.equal(deployer.address);
      });
    });

      
    describe("Buying Tokens", function () {
        it("Should update the withdrawable balances and allowances", async function () {
          const {rectangleCrowdsale, rectangleTokenContract, deployer, approvedSupply} = await loadFixture(deployRectangleCrowdsaleFixture);
          const allowance = await rectangleTokenContract.allowance(deployer.address, rectangleCrowdsale.address)
          const _approvedSupply = await rectangleCrowdsale.getAllowance();
          expect(allowance).to.equal(approvedSupply);
          expect(_approvedSupply).to.equal(approvedSupply);
        });
  
        it("Should be able to emit Token Purchase Event on buy tokens", async function () {
          const {rectangleCrowdsale, rectangleTokenContract, deployer, otherAccount, approvedSupply} = await loadFixture(deployRectangleCrowdsaleFixture);
          const amountToBuy = 50000;
          const amountToBuyInWei = ethers.utils.parseEther(`${amountToBuy}`);
          const buyTokenTx = await rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy);
          await buyTokenTx.wait(1);
          await expect(rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy)).to.emit(rectangleCrowdsale, 'TokenPurchase').withArgs(otherAccount.address, amountToBuy);
        });
     
        it("Should update the allowance and withrawable balance once user has finished buying token", async function () {
          const {rectangleCrowdsale, rectangleTokenContract, deployer, otherAccount, approvedSupply} = await loadFixture(deployRectangleCrowdsaleFixture);
          const amountToBuy = 50000;
          const amountToBuyInWei = ethers.utils.parseEther(`${amountToBuy}`);
          const allowanceBeforeTransfer  = await rectangleCrowdsale.getAllowance();
          const buyTokenTx = await rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy);
          await buyTokenTx.wait(1);
          const allowanceAfterTransfer  = await rectangleCrowdsale.getAllowance();
          const withdrawPerUserAfterTransfer = await rectangleCrowdsale.withdraws(otherAccount.address);
          const balanceOfOtherAccount = await rectangleTokenContract.balanceOf(otherAccount.address);
          expect(withdrawPerUserAfterTransfer).to.equal(amountToBuyInWei);
          expect(allowanceAfterTransfer).to.equal(allowanceBeforeTransfer.sub(amountToBuyInWei));
          expect(balanceOfOtherAccount).to.equal(amountToBuyInWei);
        });

        it("Should NOT allow buying tokens past user's withdrawable limit", async function () {
          const {rectangleCrowdsale, rectangleTokenContract, deployer, otherAccount, approvedSupply} = await loadFixture(deployRectangleCrowdsaleFixture);
            const amountToBuy = 100000;
            const buyTokenTx = await rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy);
            await buyTokenTx.wait(1);
            await expect(rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy)).to.be.revertedWithCustomError(
              rectangleCrowdsale,
              "WithdrawlLimitReached"
            );
          });

        it("Should NOT allow buying tokens when amount is greater than max limit per account", async function () {
          const {rectangleCrowdsale, rectangleTokenContract, deployer, otherAccount, approvedSupply, maxLimitPerAccount} = await loadFixture(deployRectangleCrowdsaleFixture);
          const amountToBuy = 700000;
          await expect(rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy)).to.be.revertedWithCustomError(
            rectangleCrowdsale,
            "MaxWithdrawlAllowed"
          ).withArgs(ethers.utils.parseEther(`${maxLimitPerAccount}`));
        });

        it("Should NOT allow buying tokens when user has provided some value with the transaction", async function () {
          const {rectangleCrowdsale, rectangleTokenContract, deployer, otherAccount, approvedSupply, maxLimitPerAccount} = await loadFixture(deployRectangleCrowdsaleFixture);
          const amountToBuy = 100000;  
          await expect(rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy, {
              value: ethers.utils.parseEther("1.0")
            })).to.be.revertedWith("Token is free");
        });

        it("Should NOT allow buying tokens when amount is 0", async function () {
            const {rectangleCrowdsale, rectangleTokenContract, deployer, otherAccount, approvedSupply, maxLimitPerAccount} = await loadFixture(deployRectangleCrowdsaleFixture);
            const amountToBuy = 0;  
            await expect(rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy)).to.be.revertedWith("Amount must be specified");
        });

        it("Should keep track of per user withdraws correctly ", async function () {
            const {rectangleCrowdsale, rectangleTokenContract, deployer, otherAccount, approvedSupply, maxLimitPerAccount} = await loadFixture(deployRectangleCrowdsaleFixture);
            let amountToBuy1 = 10; 
            const withdrawBalance1 = await rectangleCrowdsale.withdraws(otherAccount.address);
            await rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy1)
            expect (await rectangleCrowdsale.withdraws(otherAccount.address)).to.equal(ethers.utils.parseEther(`${withdrawBalance1.add(amountToBuy1)}`))

            const amountToBuy2 = 50000;
            const withdrawBalance2 = await rectangleCrowdsale.withdraws(otherAccount.address);
            await rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy2)              
            expect(await rectangleCrowdsale.withdraws(otherAccount.address)).to.equal(withdrawBalance2.add(ethers.utils.parseEther(`${amountToBuy2}`)))

            const amountToBuy3 = 40000;
            const withdrawBalance3 = await rectangleCrowdsale.withdraws(otherAccount.address);
            await rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy3)
            expect(await rectangleCrowdsale.withdraws(otherAccount.address)).to.equal(withdrawBalance3.add(ethers.utils.parseEther(`${amountToBuy3}`)))

            const amountToBuy4 = 9990;
            const withdrawBalance4 = await rectangleCrowdsale.withdraws(otherAccount.address);
            await rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy4)
            expect(await rectangleCrowdsale.withdraws(otherAccount.address)).to.equal(withdrawBalance4.add(ethers.utils.parseEther(`${amountToBuy4}`)))

            const amountToBuy5 = 1;
            await expect(rectangleCrowdsale.connect(otherAccount).buyTokens(amountToBuy5)).to.be.revertedWithCustomError(
              rectangleCrowdsale,
              "WithdrawlLimitReached"
            );
        });
      });
  });