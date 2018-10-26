import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
  const ParentCollection = new Mongo.Collection('parent');
  const ChildCollection = new Mongo.Collection('child');

  ParentCollection.addLinks({
    childrenLink: {
      type: 'many',
      collection: ChildCollection,
      field: 'childrenIds',
    },
  })

  if (ChildCollection.find().count() === 0) {
    for (let i = 0; i < 100; i++) {
      ChildCollection.insert({ _id: `test${i}` });
    }
    ParentCollection.insert({
      _id: 'parent1',
      childrenIds: new Array(100).fill().map((_, idx) => `test${idx}`),
    });
  }

  const queryResult = ParentCollection.createQuery({
    childrenLink: {
      _id: 'test50',
    },
  }).fetchOne();

  if (queryResult.childrenLink.length !== 1) {
    throw new Meteor.Error(`_id filters for links don\'t work. Returned count is ${queryResult.childrenLink.length}, while it should be 1`);
  }
});
