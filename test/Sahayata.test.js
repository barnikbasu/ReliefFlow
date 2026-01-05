const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SahayataProtocol", function () {
  let Sahayata, sahayata, owner, alice, bob;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    Sahayata = await ethers.getContractFactory("SahayataProtocol");
    sahayata = await Sahayata.deploy();
    await sahayata.deployed();
  });

  it("should create a request and accept donations", async function () {
    const duration = 3600 * 24; // 1 day
    await expect(sahayata.createRequest("Help A", "desc", ethers.utils.parseEther("1"), duration))
      .to.emit(sahayata, "RequestCreated");

    const id = 1;
    await sahayata.connect(alice).donate(id, { value: ethers.utils.parseEther("0.1") });
    const donated = await sahayata.donations(id, alice.address);
    expect(donated).to.equal(ethers.utils.parseEther("0.1"));
  });

  it("allows creator to withdraw when goal reached", async function () {
    const duration = 3600 * 24;
    await sahayata.createRequest("Help B", "b", ethers.utils.parseEther("1"), duration);
    const id = 1;
    // donate from alice and bob
    await sahayata.connect(alice).donate(id, { value: ethers.utils.parseEther("0.6") });
    await sahayata.connect(bob).donate(id, { value: ethers.utils.parseEther("0.4") });

    // goal reached, creator can withdraw
    await expect(sahayata.connect(owner).withdraw(id)).to.emit(sahayata, "Withdrawn");
    const r = await sahayata.getRequest(id);
    expect(r.withdrawn).to.equal(true);
  });

  it("allows refunds if goal not met after deadline", async function () {
    const duration = 1; // 1 second for test
    await sahayata.createRequest("Help C", "c", ethers.utils.parseEther("10"), duration);
    const id = 1;
    await sahayata.connect(alice).donate(id, { value: ethers.utils.parseEther("0.1") });

    // increase time past deadline
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);

    // claim refund
    await expect(sahayata.connect(alice).claimRefund(id)).to.emit(sahayata, "Refunded");
    const donatedAfter = await sahayata.donations(id, alice.address);
    expect(donatedAfter).to.equal(0);
  });
});
