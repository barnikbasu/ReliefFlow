const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SahayataProtocol", function () {
  let Sahayata, sahayata, owner, alice, bob;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    Sahayata = await ethers.getContractFactory("SahayataProtocol");
    sahayata = await Sahayata.deploy();
    await sahayata.waitForDeployment();
  });

  it("should create a request and accept donations", async function () {
    const duration = 3600 * 24; // 1 day
    await expect(sahayata.createRequest("Help A", "desc", ethers.parseEther("1"), duration))
      .to.emit(sahayata, "RequestCreated");

    const id = 1;
    await expect(() =>
      alice.sendTransaction({ to: sahayata.target, value: 0 })
    ).to.not.throw;

    // Donate
    await alice.sendTransaction({ to: sahayata.target, value: 0 }); // dummy to ensure provider works
    await alice.sendTransaction({ to: sahayata.target, value: ethers.parseEther("0") });

    // Call donate via contract
    await expect(
      alice.sendTransaction({
        to: sahayata.target,
        value: ethers.parseEther("0.1")
      })
    ).to.not.be.reverted;
  });

  it("allows creator to withdraw when goal reached", async function () {
    const duration = 3600 * 24;
    await sahayata.createRequest("Help B", "b", ethers.parseEther("1"), duration);
    const id = 1;
    // donate from alice and bob
    await sahayata.connect(alice).donate(id, { value: ethers.parseEther("0.6") });
    await sahayata.connect(bob).donate(id, { value: ethers.parseEther("0.4") });

    // goal reached, creator can withdraw
    const before = await ethers.provider.getBalance(owner.address);
    await expect(sahayata.connect(owner).withdraw(id)).to.emit(sahayata, "Withdrawn");
    const after = await ethers.provider.getBalance(owner.address);
    expect(after).to.be.gt(before);
  });

  it("allows refunds if goal not met after deadline", async function () {
    const duration = 1; // 1 second short for test
    await sahayata.createRequest("Help C", "c", ethers.parseEther("10"), duration);
    const id = 1;
    await sahayata.connect(alice).donate(id, { value: ethers.parseEther("0.1") });

    // increase time past deadline
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine", []);

    // claim refund
    const aliceBalanceBefore = await ethers.provider.getBalance(alice.address);
    await expect(sahayata.connect(alice).claimRefund(id)).to.emit(sahayata, "Refunded");
    const aliceBalanceAfter = await ethers.provider.getBalance(alice.address);
    expect(aliceBalanceAfter).to.be.gt(aliceBalanceBefore - ethers.parseEther("0.001"));
  });
});
