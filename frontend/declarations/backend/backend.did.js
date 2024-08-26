export const idlFactory = ({ IDL }) => {
  const Book = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'description' : IDL.Text,
    'author' : IDL.Text,
    'imageUrl' : IDL.Text,
    'price' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : Book, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'getBookDetails' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'getBooks' : IDL.Func([], [IDL.Vec(Book)], ['query']),
    'getUserPurchases' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'purchaseBook' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
