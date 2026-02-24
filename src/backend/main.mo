import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";

actor {
  type Appointment = {
    id : Nat;
    title : Text;
    description : Text;
    date : Time.Time;
    duration : Nat;
    alarmEnabled : Bool;
    alarmOffset : ?Nat;
  };

  module Appointment {
    public func compare(a : Appointment, b : Appointment) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  let appointments = Map.empty<Nat, Appointment>();
  var nextId = 0;

  public shared ({ caller }) func createAppointment(
    title : Text,
    description : Text,
    date : Time.Time,
    duration : Nat,
    alarmEnabled : Bool,
    alarmOffset : ?Nat,
  ) : async Nat {
    let id = nextId;
    nextId += 1;

    let appointment : Appointment = {
      id;
      title;
      description;
      date;
      duration;
      alarmEnabled;
      alarmOffset;
    };

    appointments.add(id, appointment);
    id;
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    appointments.values().toArray().sort();
  };

  public query ({ caller }) func getAppointment(id : Nat) : async Appointment {
    switch (appointments.get(id)) {
      case (?appointment) { appointment };
      case (null) { Runtime.trap("Appointment not found") };
    };
  };

  public shared ({ caller }) func updateAppointment(
    id : Nat,
    title : Text,
    description : Text,
    date : Time.Time,
    duration : Nat,
    alarmEnabled : Bool,
    alarmOffset : ?Nat,
  ) : async () {
    switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?_) {
        let updatedAppointment : Appointment = {
          id;
          title;
          description;
          date;
          duration;
          alarmEnabled;
          alarmOffset;
        };
        appointments.add(id, updatedAppointment);
      };
    };
  };

  public shared ({ caller }) func deleteAppointment(id : Nat) : async () {
    if (not appointments.containsKey(id)) {
      Runtime.trap("Appointment not found");
    };
    appointments.remove(id);
  };
};
