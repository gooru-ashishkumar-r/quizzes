import Ember from 'ember';
import Collection from 'quizzes-addon/models/collection/collection';
import Resource from 'quizzes-addon/models/resource/resource';
import ResourceResult from 'quizzes-addon/models/result/resource';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/report-data', 'Unit | Model | result/report-data');

test('resourceIds', function(assert) {
  const model = this.subject({
    collection: Collection.create({
      resources: Ember.A([
        Resource.create({
          id: 'resource1'
        }),
        Resource.create({
          id: 'resource2'
        })
      ])
    })
  });

  assert.equal(model.get('resourceIds').length, 2, 'Wrong total resources');
  assert.equal(model.get('resourceIds')[0], 'resource1', 'Wrong resource 1 id');
  assert.equal(model.get('resourceIds')[1], 'resource2', 'Wrong resource 2 id');
});

test('studentIds', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1'
      }),
      ReportDataEvent.create({
        profileId: 'student2'
      })
    ])
  });

  assert.equal(model.get('studentIds').length, 2, 'Wrong total students');
  assert.equal(model.get('studentIds')[0], 'student1', 'Wrong student 1 id');
  assert.equal(model.get('studentIds')[1], 'student2', 'Wrong student 2 id');
});

test('students', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileCode: 'code1',
        profileName: 'name1'
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileCode: 'code2',
        profileName: 'name2'
      })
    ])
  });

  assert.equal(model.get('students').length, 2, 'Wrong total students');
  assert.equal(model.get('students')[0].id, 'student1', 'Wrong student 1 id');
  assert.equal(model.get('students')[0].code, 'code1', 'Wrong student 1 code');
  assert.equal(
    model.get('students')[0].fullName,
    'name1',
    'Wrong student 1 name'
  );
  assert.equal(model.get('students')[1].id, 'student2', 'Wrong student 2 id');
  assert.equal(model.get('students')[1].code, 'code2', 'Wrong student 1 code');
  assert.equal(
    model.get('students')[1].fullName,
    'name2',
    'Wrong student 1 name'
  );
});

test('findByProfileId', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileName: 'name1'
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileName: 'name2'
      })
    ])
  });

  assert.equal(
    model.findByProfileId('student2')[0].get('profileName'),
    'name2',
    'Wrong student found'
  );
});

test('getResultsByQuestion', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileName: 'name1',
        resourceResults: [
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ]
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileName: 'name2',
        resourceResults: [
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ]
      })
    ])
  });

  // Change a previous result
  const response = model.getResultsByQuestion('q2');
  assert.equal(response.length, 2, 'Results count should be two');
  assert.equal(
    response[0].get('resourceId'),
    'q2',
    'First result should have the correct id'
  );
  assert.equal(
    response[1].get('resourceId'),
    'q2',
    'Second result should have the correct id'
  );
});

test('getStudentsByQuestionAndAnswer', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileName: 'name1',
        resourceResults: [
          ResourceResult.create({
            resourceId: 'q1',
            score: 0,
            answer: [
              {
                value: '2'
              }
            ]
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ]
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileName: 'name2',
        resourceResults: [
          ResourceResult.create({
            resourceId: 'q1',
            score: 0,
            answer: [
              {
                value: '1'
              }
            ]
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ]
      })
    ])
  });

  const question = Resource.create({
    id: 'q1'
  });
  const answer = [
    {
      value: '1'
    }
  ];

  // Change a previous result
  const response = model.getStudentsByQuestionAndAnswer(question, answer);
  assert.equal(response.length, 1, 'Results count should be one');
  assert.equal(
    response[0].get('id'),
    'student2',
    'First result should have the correct id'
  );
  assert.equal(
    response[0].get('fullName'),
    'name2',
    'First result should have the correct full name'
  );
});

test('parseFinishEvent', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileName: 'name1',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileName: 'name2',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      })
    ])
  });

  const newEvent = {
    profileId: 'student2',
    eventBody: {
      eventSummary: {
        totalAnswered: 10,
        totalCorrect: 7,
        averageReaction: 2,
        averageScore: 90,
        totalTimeSpent: 1000
      }
    }
  };

  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(0).get('score'),
    0,
    'Score before parse should match'
  );
  model.parseFinishEvent(newEvent);
  assert.equal(
    model.get('reportEvents').get(1).get('averageReaction'),
    2,
    'Average reaction after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('averageScore'),
    90,
    'Average score after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('totalAnswered'),
    10,
    'Total answered after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('totalCorrect'),
    7,
    'Total correct after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('totalTimeSpent'),
    1000,
    'Total time spent after parse should match'
  );
});

test('parseOnResourceEvent', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileName: 'name1',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileName: 'name2',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      })
    ])
  });

  const newEvent = {
    profileId: 'student2',
    eventBody: {
      previousResource: {
        resourceId: 'q1',
        score: 100,
        reaction: 1
      },
      eventSummary: {
        totalAnswered: 10,
        totalCorrect: 7,
        averageReaction: 2,
        averageScore: 90,
        totalTimeSpent: 1000
      }
    }
  };

  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(0).get('score'),
    0,
    'Score before parse should match'
  );
  model.parseOnResourceEvent(newEvent);
  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(0).get('score'),
    100,
    'Score after parse should match'
  );
  assert.equal(
    model
      .get('reportEvents')
      .get(1)
      .get('resourceResults')
      .get(0)
      .get('reaction'),
    1,
    'Reaction after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('averageReaction'),
    2,
    'Average reaction after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('averageScore'),
    90,
    'Average score after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('totalAnswered'),
    10,
    'Total answered after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('totalCorrect'),
    7,
    'Total correct after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('totalTimeSpent'),
    1000,
    'Total time spent after parse should match'
  );
});

test('parseStartEvent', function(assert) {
  const model = this.subject(Ember.getOwner(this).ownerInjection());
  model.setProperties({
    collection: Collection.create({
      resources: Ember.A([
        Resource.create({
          id: 'q1'
        }),
        Resource.create({
          id: 'q2'
        })
      ])
    }),
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileName: 'name1',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      }),
      ReportDataEvent.create({
        averageScore: 100,
        averageReaction: 2,
        totalAnswered: 1,
        totalCorrect: 1,
        totalTimeSpent: 10000,
        profileId: 'student2',
        profileName: 'name2',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      })
    ])
  });

  const newEvent = {
    profileId: 'student3',
    profileName: 'name3',
    eventBody: {
      isNewAttempt: true,
      currentResourceId: 'q2'
    }
  };

  // with a new student
  assert.equal(
    model.get('reportEvents').length,
    2,
    'Resource results length before parse should match'
  );
  model.parseStartEvent(newEvent);
  assert.equal(
    model.get('reportEvents').length,
    3,
    'Resource results lenght after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(2).get('profileId'),
    'student3',
    'Second id after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(2).get('currentResourceId'),
    'q2',
    'Current resource after parse should match'
  );
  assert.ok(
    model.get('reportEvents').get(2).get('isAttemptStarted'),
    'Is attempt started after parse should match'
  );
  assert.notOk(
    model.get('reportEvents').get(2).get('isAttemptFinished'),
    'Is attempt finished after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(2).get('averageScore'),
    0,
    'Average score after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(2).get('averageReaction'),
    0,
    'Average reaction after parse should match'
  );
  assert.equal(
    model
      .get('reportEvents')
      .get(2)
      .get('resourceResults')
      .get(0)
      .get('reaction'),
    0,
    'First reaction after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(2).get('resourceResults').get(0).get('score'),
    0,
    'First score after parse should match'
  );
  assert.equal(
    model
      .get('reportEvents')
      .get(2)
      .get('resourceResults')
      .get(1)
      .get('reaction'),
    0,
    'Second reaction after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(2).get('resourceResults').get(1).get('score'),
    0,
    'Second score after parse should match'
  );

  // existing student
  newEvent.profileId = 'student2';
  newEvent.profileName = 'name2';
  model.parseStartEvent(newEvent);
  assert.equal(
    model.get('reportEvents').get(1).get('profileId'),
    'student2',
    'Id after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('currentResourceId'),
    'q2',
    'Current resource after parse should match'
  );
  assert.ok(
    model.get('reportEvents').get(1).get('isAttemptStarted'),
    'Is attempt started after parse should match'
  );
  assert.notOk(
    model.get('reportEvents').get(1).get('isAttemptFinished'),
    'Is attempt finished after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('averageScore'),
    0,
    'Average score after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('averageReaction'),
    0,
    'Average reaction after parse should match'
  );
  assert.equal(
    model
      .get('reportEvents')
      .get(1)
      .get('resourceResults')
      .get(0)
      .get('reaction'),
    0,
    'First reaction after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(0).get('score'),
    0,
    'First score after parse should match'
  );
  assert.equal(
    model
      .get('reportEvents')
      .get(1)
      .get('resourceResults')
      .get(1)
      .get('reaction'),
    0,
    'Second reaction after parse should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(1).get('score'),
    0,
    'Second score after parse should match'
  );
});

test('setCollection', function(assert) {
  const collection = Collection.create({
    resources: Ember.A([
      Resource.create({
        id: 'q1'
      }),
      Resource.create({
        id: 'q2'
      }),
      Resource.create({
        id: 'q3'
      }),
      Resource.create({
        id: 'q4'
      })
    ])
  });
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
        profileId: 'student1',
        profileName: 'name1',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 100
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 100
          }),
          ResourceResult.create({
            resourceId: 'q3',
            score: 0,
            skipped: true
          })
        ])
      }),
      ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
        profileId: 'student2',
        profileName: 'name2',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 100
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 100
          }),
          ResourceResult.create({
            resourceId: 'q3',
            score: 100
          }),
          ResourceResult.create({
            resourceId: 'q4',
            score: 100
          })
        ])
      })
    ])
  });

  model.setCollection(collection);
  assert.equal(
    model.get('reportEvents').get(0).get('profileId'),
    'student1',
    'Profile id should match'
  );
  assert.equal(
    model.get('reportEvents').get(0).get('resourceResults').get(0).get('score'),
    100,
    'First score for first student should not change'
  );
  assert.equal(
    model.get('reportEvents').get(0).get('resourceResults').get(2).get('score'),
    0,
    'Third score for first student should change'
  );
  assert.ok(
    model
      .get('reportEvents')
      .get(0)
      .get('resourceResults')
      .get(2)
      .get('skipped'),
    'Third question for first student should be skipped'
  );
  assert.equal(
    model.get('reportEvents').get(0).get('resourceResults').get(3).get('score'),
    0,
    'Fourth score for first student should change'
  );
  assert.ok(
    model
      .get('reportEvents')
      .get(0)
      .get('resourceResults')
      .get(3)
      .get('skipped'),
    'Fourth question for first student should be skipped'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('profileId'),
    'student2',
    'Profile id should match'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(0).get('score'),
    100,
    'First student scores should not change'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(1).get('score'),
    100,
    'Second student scores should not change'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(2).get('score'),
    100,
    'Third student scores should not change'
  );
  assert.equal(
    model.get('reportEvents').get(1).get('resourceResults').get(3).get('score'),
    100,
    'Fourth student scores should not change'
  );
});

test('getResultsByQuestion', function(assert) {
  const model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileName: 'name1',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileName: 'name2',
        resourceResults: Ember.A([
          ResourceResult.create({
            resourceId: 'q1',
            score: 0
          }),
          ResourceResult.create({
            resourceId: 'q2',
            score: 0
          })
        ])
      })
    ])
  });

  // Change a previous result
  const response = model.getResultsByQuestion('q2');
  assert.equal(response.length, 2, 'Results count should be two');
  assert.equal(
    response[0].get('resourceId'),
    'q2',
    'First result should have the correct id'
  );
  assert.equal(
    response[1].get('resourceId'),
    'q2',
    'Second result should have the correct id'
  );
});
