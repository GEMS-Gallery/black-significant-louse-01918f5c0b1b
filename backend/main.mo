import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";

actor {
  // Types
  type Book = {
    id: Nat;
    title: Text;
    author: Text;
    description: Text;
    price: Nat;
    imageUrl: Text;
  };

  type Purchase = {
    userId: Principal;
    bookId: Nat;
  };

  // Stable variables
  stable var nextBookId: Nat = 0;
  stable var booksEntries: [(Nat, Book)] = [];
  stable var purchasesEntries: [(Principal, [Nat])] = [];

  // In-memory storage
  var books = HashMap.HashMap<Nat, Book>(10, Nat.equal, Hash.hash);
  var purchases = HashMap.HashMap<Principal, [Nat]>(10, Principal.equal, Principal.hash);

  // Initialize books
  private func initBooks() {
    let initialBooks: [Book] = [
      { id = 0; title = "Mastering Ethereum"; author = "Andreas M. Antonopoulos"; description = "A comprehensive guide to Ethereum"; price = 2999; imageUrl = "https://fakeimg.pl/300x400?text=Mastering+Ethereum" },
      { id = 1; title = "The Infinite Machine"; author = "Camila Russo"; description = "The story of Ethereum"; price = 1999; imageUrl = "https://fakeimg.pl/300x400?text=The+Infinite+Machine" },
      { id = 2; title = "Token Economy"; author = "Shermin Voshmgir"; description = "How the Web3 reinvents the Internet"; price = 2499; imageUrl = "https://fakeimg.pl/300x400?text=Token+Economy" }
    ];

    for (book in initialBooks.vals()) {
      books.put(book.id, book);
      nextBookId += 1;
    };
  };

  // System functions
  system func preupgrade() {
    booksEntries := Iter.toArray(books.entries());
    purchasesEntries := Iter.toArray(purchases.entries());
  };

  system func postupgrade() {
    books := HashMap.fromIter<Nat, Book>(booksEntries.vals(), 10, Nat.equal, Hash.hash);
    purchases := HashMap.fromIter<Principal, [Nat]>(purchasesEntries.vals(), 10, Principal.equal, Principal.hash);

    if (books.size() == 0) {
      initBooks();
    };
  };

  // Query functions
  public query func getBooks() : async [Book] {
    Iter.toArray(books.vals())
  };

  public query func getBookDetails(id: Nat) : async Result.Result<Book, Text> {
    switch (books.get(id)) {
      case (null) { #err("Book not found") };
      case (?book) { #ok(book) };
    }
  };

  public query func getUserPurchases(userId: Principal) : async [Nat] {
    switch (purchases.get(userId)) {
      case (null) { [] };
      case (?userPurchases) { userPurchases };
    }
  };

  // Update functions
  public shared(msg) func purchaseBook(bookId: Nat) : async Result.Result<Text, Text> {
    let caller = msg.caller;
    
    switch (books.get(bookId)) {
      case (null) { #err("Book not found") };
      case (?book) {
        var userPurchases = switch (purchases.get(caller)) {
          case (null) { [] };
          case (?existing) { existing };
        };
        
        userPurchases := Array.append(userPurchases, [bookId]);
        purchases.put(caller, userPurchases);
        
        #ok("Book purchased successfully")
      };
    }
  };
}
