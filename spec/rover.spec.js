const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts", function() {
    let rover = new Rover(98382);
    expect(rover.position).toEqual(98382);
    expect(rover.mode).toEqual('NORMAL');
    expect(rover.generatorWatts).toEqual(110);
  });

  it("response returned by receiveMessage contains the name of the message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Testing', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual('Testing');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Testing message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results.length).toEqual(2);
  });

  it("responds correctly to the status check command", function() {
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Testing message for status check', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(response.results[0].roverStatus.mode).toEqual('NORMAL');
    expect(response.results[0].roverStatus.generatorWatts).toEqual(110);
    expect(response.results[0].roverStatus.position).toEqual(98382);
  });

  it("responds correctly to the mode change command", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Test message for mode change', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(rover.mode).toEqual('LOW_POWER');
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 12345)];
    let message = new Message('Test message for move in low power mode', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[1].completed).toEqual(false);
    expect(rover.position).toEqual(98382);
  });

  it("responds with the position for the move command", function() {
    let commands = [new Command('MOVE', 12345)];
    let message = new Message('Test message for move command', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(rover.position).toEqual(12345);
  });

});
