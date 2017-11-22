require('../../utils.js');

const questions = require('../../questions');
const command = require('inquirer');
const h = require('../../helpers.js');
const validators = require('../../validators.js');


class TokenSaleOptions {
  constructor(parameters) {
    this.setTokenPrice(parameters.tokenPrice)
    this.setWallet(parameters.wallet)
    this.setMinimumInvestment(parameters.minimumInvestment)
    this.setCapped(parameters.capped)
    this.setCap(parameters.cap)
    this.setTimed(parameters.timed)
    this.setTimeLimits(parameters.startTime, parameters.endTime)
    this.setStarteable(parameters.starteable)
    this.setFinalizeable(parameters.finalizeable)
    this.setDiscounted(parameters.discounted)
    this.setLockableTransfers(parameters.lockableTransfers)
    this.setAllowControllerTransfer(parameters.allowControllerTransfer)
    this.setContractName(parameters.type)
    this.setContributors(parameters.contributors)
    this.setProxy(parameters.proxy)
  }

  setTokenPrice(value) {
    this.tokenPrice = value || ''
  }

  setWallet(value) {
    this.wallet = value || ''
  }

  setContributors(value) {
    this.contributors = value || ''
  }

  setMinimumInvestment(value) {
    this.minimumInvestment = value || 0
  }

  setCapped(value) {
    this.capped = value || false
  }

  setCap(value) {
    this.cap = value || ''
  }

  setTimed(value) {
    this.timed = value || false
  }

  //TODO replace typeof by a more sophisticated check
  setTimeLimits(startTime, endTime) {
    if (startTime && endTime) {
      if (typeof startTime == "object" && typeof endTime == "object") {
        this.startTime = h.toTimestamp(startTime);
        this.endTime = h.toTimestamp(endTime);
      } else {
        this.startTime = startTime;
        this.endTime = endTime;
      }
    } else {
      this.startTime = ''
      this.endTime = ''
    }
  }

  setDiscounted(value) {
    this.discounted = value || false
  }

  setStarteable(value) {
    this.starteable = value || false
  }

  setFinalizeable(value) {
    this.finalizeable = value || true
  }

  setLockableTransfers(value) {
    this.lockableTransfers = value || true
  }

  setContractName(value) {
    if (value == "PRESALE") {
      this.contractName = 'Presale'
    } else {
      this.contractName = 'TokenSale'
    }
  }

  setAllowControllerTransfer(value) {
    this.allowControllerTransfer = value || true
  }

  setContributors(value) {
    this.contributors = value || false
  }

  setType(value) {
    this.isPresale = value || false
  }

  setProxy(value) {
    this.proxy = value || false
  }

  setContributors(value) {
    this.contributors = value || false
  }

  async updateBasicOptions() {
    let { tokenPrice, minimumInvestment, wallet } = await command.prompt(questions.tokenSale)
    this.setTokenPrice(tokenPrice)
    this.setMinimumInvestment(minimumInvestment)
    this.setWallet(wallet)
  }

  async updateCapOptions() {
    const { type, cap } = await command.prompt(questions.tokenSaleCap);
    if (type === 'Capped') {
      this.capped = true;
      this.cap = cap;
    } else {
      this.capped = false;
    }
  }

  async updateAdvancedOptions() {
    const results = await command.prompt(questions.tokenSaleAdvancedOptions);
    this.setFinalizeable(results.finalizeable)
    this.setStarteable(results.starteable)
    this.setContributors(results.contributors)
    this.setAllowControllerTransfer(results.allowControllerTransfer)
    this.setLockableTransfers(results.lockableTransfers)
    this.setProxy(results.proxy)
    this.setContributors(results.contributors)
  }

  async updateTimeLimits(value) {
    const { timed, startTime, endTime } = await command.prompt(questions.tokenSaleTimeLimits);
    this.setTimed(timed)
    this.setTimeLimits(startTime, endTime)
  }

  // TODO complete this validation
  isComplete() {
    try {
      if (!validator.isPositiveNumber(this.cap)) {
        return false;
      } else if (!validator.isPositiveNumber(this.tokenPrice)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // TODO refactor to an array structure
  // TODO include the parentContracts variable in the TokenOptions without displaying it in the configuration
  // TODO personalize depending on the options
  resolveImports() {
    return { safeMath: true, pausable: true, tokenInterface: true };
  }

  // TODO refactor to an array structure
  // TODO include the parentContracts variable in the TokenOptions
  // TODO personalize depending on the options
  resolveParentContracts() {
    return { pausable: true };
  }
}

module.exports = TokenSaleOptions;
