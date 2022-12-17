const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { expect } = require("chai");
  
  describe("Rectangle", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployRectangleFixture() {
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();
      const length = 2;
      const width = 2;
      const Rectangle = await ethers.getContractFactory("Rectangle");
      const rectangle = await Rectangle.deploy(length, width);
  
      return { rectangle, length, width, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set the right length and width", async function () {
        const { rectangle, length , width } = await loadFixture(deployRectangleFixture);
        expect(await rectangle.getArea()).to.equal(length * width);
      });
  
      it("Should set the right owner", async function () {
        const { rectangle, owner } = await loadFixture(deployRectangleFixture);
        expect(await rectangle.owner()).to.equal(owner.address);
      });
    });
  
    describe("Dimensions", function () {
      it("Should emit an event on setting new length", async function () {
        const { rectangle, owner } = await loadFixture(
          deployRectangleFixture
        );
        const _newLength = 3;
        await expect(rectangle.setLength(_newLength))
            .to.emit(rectangle, "LengthChanged")
            .withArgs(_newLength); // We accept any value as `when` arg
      });
  
      it("Should emit an event on setting new width", async function () {
        const { rectangle, owner } = await loadFixture(
          deployRectangleFixture
        );
        const _newWidth = 3;
        await expect(rectangle.setWidth(_newWidth))
            .to.emit(rectangle, "WidthChanged")
            .withArgs(_newWidth); // We accept any value as `when` arg
      });
    });
  });