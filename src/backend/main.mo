import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  public type ScoreEntry = {
    playerName : Text;
    score : Nat;
    timestamp : Time.Time;
  };

  public type Mission = {
    id : Nat;
    description : Text;
    goal : Nat;
    completed : Bool;
    progress : Nat;
    reward : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  module ScoreEntry {
    public func compare(a : ScoreEntry, b : ScoreEntry) : Order.Order {
      Nat.compare(b.score, a.score);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let leaderboards = Map.empty<Text, List.List<ScoreEntry>>();
  let missions = Map.empty<Text, List.List<Mission>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Leaderboard functions

  public shared ({ caller }) func submitScore(name : Text, score : Nat, mode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit scores");
    };

    let entry : ScoreEntry = {
      playerName = name;
      score;
      timestamp = Time.now();
    };

    switch (leaderboards.get(mode)) {
      case (null) {
        let newList = List.empty<ScoreEntry>();
        newList.add(entry);
        leaderboards.add(mode, newList);
      };
      case (?existing) {
        existing.add(entry);
      };
    };
  };

  public query func getTopScores(mode : Text, limit : Nat) : async [ScoreEntry] {
    switch (leaderboards.get(mode)) {
      case (null) { [] };
      case (?entries) {
        let arrayEntries = entries.toArray();
        let sorted = arrayEntries.sort();
        let size = Nat.min(limit, sorted.size());
        sorted.sliceToArray(0, size);
      };
    };
  };

  public query func getAllScores(mode : Text) : async [ScoreEntry] {
    switch (leaderboards.get(mode)) {
      case (null) { [] };
      case (?scores) {
        scores.values().toArray();
      };
    };
  };

  // Mission management functions

  public shared ({ caller }) func addMission(mode : Text, id : Nat, description : Text, goal : Nat, reward : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add missions");
    };

    let newMission : Mission = {
      id;
      description;
      goal;
      completed = false;
      progress = 0;
      reward;
    };

    switch (missions.get(mode)) {
      case (null) {
        let newList = List.empty<Mission>();
        newList.add(newMission);
        missions.add(mode, newList);
      };
      case (?existing) {
        existing.add(newMission);
      };
    };
  };

  public shared ({ caller }) func updateMissionProgress(mode : Text, id : Nat, progress : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update mission progress");
    };

    switch (missions.get(mode)) {
      case (null) { false };
      case (?missionList) {
        var missionFound = false;
        let updatedList = missionList.map<Mission, Mission>(
          func(m) {
            if (m.id == id) {
              missionFound := true;
              {
                id = m.id;
                description = m.description;
                goal = m.goal;
                completed = progress >= m.goal;
                progress;
                reward = m.reward;
              };
            } else {
              m;
            };
          }
        );
        if (missionFound) {
          missions.add(mode, updatedList);
        };
        missionFound;
      };
    };
  };

  public query func isMissionCompleted(mode : Text, id : Nat) : async Bool {
    switch (missions.get(mode)) {
      case (null) { false };
      case (?missionList) {
        let iter = missionList.values();
        let found = iter.find(func(m) { m.id == id });
        switch (found) {
          case (null) { false };
          case (?mission) { mission.completed };
        };
      };
    };
  };

  public query func getMissionReward(mode : Text, id : Nat) : async Text {
    switch (missions.get(mode)) {
      case (null) { Runtime.trap("Mode not found") };
      case (?missionList) {
        let iter = missionList.values();
        let found = iter.find(func(m) { m.id == id });
        switch (found) {
          case (null) { Runtime.trap("Mission not found") };
          case (?mission) { mission.reward };
        };
      };
    };
  };
};
