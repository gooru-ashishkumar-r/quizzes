import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';
import TaxonomyRoot from 'quizzes-addon/models/taxonomy/taxonomy-root';
import TaxonomyItem from 'quizzes-addon/models/taxonomy/taxonomy-item';

moduleForService(
  'service:quizzes/taxonomy',
  'Unit | Service | quizzes/taxonomy',
  {
    beforeEach: function() {
      this.taxonomySubjects = Ember.A([
        TaxonomyRoot.create(Ember.getOwner(this).ownerInjection(), {
          id: 'GDF.K12.VPA',
          frameworkId: 'GDF',
          title: 'Visual & Performing Arts',
          subjectTitle: 'Visual & Performing Arts',
          code: 'GDF.K12.VPA',
          frameworks: Ember.A([
            TaxonomyRoot.create(Ember.getOwner(this).ownerInjection(), {
              id: 'TEKS.K12.FA',
              frameworkId: 'TEKS',
              title: 'Texas Essential Knowledge and Skills',
              subjectTitle: 'TEKS Visual & Performing Arts',
              courses: Ember.A([
                TaxonomyItem.create(Ember.getOwner(this).ownerInjection(), {
                  id: 'TEKS.K12.PE-K',
                  code: 'TEKS.K12.PE-K',
                  title: 'Kindergarten',
                  children: Ember.A([
                    TaxonomyItem.create(Ember.getOwner(this).ownerInjection(), {
                      id: 'TEKS.K12.PE-K-MOV',
                      code: 'TEKS.K12.PE-K-MOV',
                      title: 'Movement',
                      children: Ember.A([
                        TaxonomyItem.create(
                          Ember.getOwner(this).ownerInjection(),
                          {
                            id: 'TEKS.K12.PE-K-MOV-01',
                            code: 'TEKS.PE.K.1',
                            title:
                              'The student demonstrates competency in fundamental movement patterns and proficiency in a few specialized movement forms.',
                            codeType: 'standard_level_1'
                          }
                        ),
                        TaxonomyItem.create(
                          Ember.getOwner(this).ownerInjection(),
                          {
                            id: 'TEKS.K12.PE-K-MOV-02',
                            code: 'TEKS.PE.K.2',
                            title:
                              'The student applies movement concepts and principles to the learning and development of motor skills.',
                            codeType: 'standard_level_1'
                          }
                        )
                      ])
                    }),
                    TaxonomyItem.create(Ember.getOwner(this).ownerInjection(), {
                      id: 'TEKS.K12.PE-K-PAH',
                      code: 'TEKS.K12.PE-K-PAH',
                      title: 'Physical activity and health'
                    })
                  ])
                }),
                TaxonomyItem.create(Ember.getOwner(this).ownerInjection(), {
                  id: 'TEKS.K12.PE-1',
                  code: 'TEKS.K12.PE-1',
                  title: 'Grade 1'
                })
              ])
            })
          ])
        }),
        TaxonomyRoot.create(Ember.getOwner(this).ownerInjection(), {
          id: 'GDF.K12.CS',
          frameworkId: 'GDF',
          title: 'Computer Science',
          subjectTitle: 'Computer Science',
          code: 'GDF.K12.CS',
          courses: []
        })
      ]);
    }
  }
);

test('getSubjects when taxonomy container has not been loaded', function(
  assert
) {
  const test = this;
  const service = this.subject();
  assert.expect(3); // Just the first time the taxonomy data should be loaded for every category.
  service.set('taxonomyContainer', {});
  service.set(
    'apiTaxonomyService',
    Ember.Object.create({
      fetchSubjects: function() {
        assert.ok(true); // This assert should be evaluated for every subject category
        return Ember.RSVP.resolve(test.taxonomySubjects);
      }
    })
  );
  var done = assert.async();
  service.getSubjects('k_12').then(function() {
    service
      .getSubjects('higher_education') // The second call should not be calling the API fetchSubject method. The taxonomy subjects should be already loaded.
      .then(function() {
        done();
      });
  });
});

test('getSubjects when taxonomy is already loaded', function(assert) {
  const service = this.subject();
  const taxonomyContainer = {
    k_12: this.taxonomySubjects
  };
  service.set('taxonomyContainer', taxonomyContainer);
  service.set(
    'apiTaxonomyService',
    Ember.Object.create({
      fetchSubjects: function() {
        assert.ok(false, 'Method fetchSubjects() should not be called.');
        return Ember.RSVP.resolve([]);
      }
    })
  );
  var done = assert.async();
  service.getSubjects('k_12').then(function(subjects) {
    assert.equal(subjects.length, 2, 'Wrong number of subject elements');
    done();
  });
});

test('getCourses when taxonomy courses does not exist for subject', function(
  assert
) {
  const test = this;
  const service = this.subject();
  service.set(
    'apiTaxonomyService',
    Ember.Object.create({
      fetchCourses: function() {
        const courses = [
          TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
            id: 'TEKS.K12.PE-2',
            code: 'TEKS.K12.PE-2',
            title: 'Grade 2'
          }),
          TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
            id: 'TEKS.K12.PE-3',
            code: 'TEKS.K12.PE-3',
            title: 'Grade 3'
          })
        ];
        return Ember.RSVP.resolve(courses);
      }
    })
  );
  var done = assert.async();
  const subject = TaxonomyRoot.create(Ember.getOwner(test).ownerInjection(), {
    id: 'GDF.K12.CS',
    frameworkId: 'GDF',
    courses: []
  });
  service.getCourses(subject).then(function(courses) {
    assert.equal(courses.length, 2, 'Wrong number of courses');
    assert.equal(
      courses.objectAt(0).get('id'),
      'TEKS.K12.PE-2',
      'Wrong course id'
    );
    done();
  });
});

test('getCourses when taxonomy courses exist for subject', function(assert) {
  const test = this;
  const service = this.subject();
  service.set(
    'apiTaxonomyService',
    Ember.Object.create({
      fetchCourses: function() {
        assert.ok(false, 'Method fetchCourses() should not be called.');
        return Ember.RSVP.resolve([]);
      }
    })
  );
  var done = assert.async();
  const subject = TaxonomyRoot.create(Ember.getOwner(test).ownerInjection(), {
    id: 'TEKS.K12.FA',
    frameworkId: 'TEKS',
    courses: [
      TaxonomyItem.create(Ember.getOwner(this).ownerInjection(), {
        id: 'TEKS.K12.PE-K',
        code: 'TEKS.K12.PE-K',
        title: 'Kindergarten'
      }),
      TaxonomyItem.create(Ember.getOwner(this).ownerInjection(), {
        id: 'TEKS.K12.PE-1',
        code: 'TEKS.K12.PE-1',
        title: 'Grade 1'
      })
    ]
  });
  service.getCourses(subject).then(function(courses) {
    assert.equal(courses.length, 2, 'Wrong number of courses');
    assert.equal(
      courses.objectAt(0).get('id'),
      'TEKS.K12.PE-K',
      'Wrong course id'
    );
    done();
  });
});

/*
test('getDomains when taxonomy domains does not exist for course', function(assert) {
  const test = this;
  const service = this.subject();
  service.set('apiTaxonomyService', Ember.Object.create({
    fetchDomains: function() {
      const domains = [
        TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
          id: 'TEKS.K12.PE-K-MOV',
          code: 'TEKS.K12.PE-K-MOV',
          title: 'Movement'
        }),
        TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
          id: 'TEKS.K12.PE-K-PAH',
          code: 'TEKS.K12.PE-K-PAH',
          title: 'Physical activity and health'
        })
      ];
      return Ember.RSVP.resolve(domains);
    }
  }));
  var done = assert.async();
  const subject = TaxonomyRoot.create(Ember.getOwner(test).ownerInjection(), {
    id: 'GDF.K12.CS',
    frameworkId: 'GDF'
  });
  const course = TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
    id: 'TEKS.K12.PE-K',
    code: 'TEKS.K12.PE-K',
    children: []
  });
  service.getDomains(subject, course)
    .then(function(domains) {
      assert.equal(domains.length, 2, 'Wrong number of courses');
      assert.equal(domains.objectAt(0).get('id'), 'TEKS.K12.PE-K-MOV', 'Wrong domain id');
      done();
    });
});

test('getDomains when taxonomy domains exist for course', function(assert) {
  const test = this;
  const service = this.subject();
  service.set('apiTaxonomyService', Ember.Object.create({
    fetchDomains: function() {
      assert.ok(false, 'Method fetchDomains() should not be called.');
      return Ember.RSVP.resolve([]);
    }
  }));
  var done = assert.async();
  const subject = TaxonomyRoot.create(Ember.getOwner(test).ownerInjection(), {
    id: 'GDF.K12.CS',
    frameworkId: 'GDF'
  });
  const course = TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
    id: 'TEKS.K12.PE-K',
    code: 'TEKS.K12.PE-K',
    children: [
      TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
        id: 'TEKS.K12.PE-K-MOV',
        code: 'TEKS.K12.PE-K-MOV',
        title: 'Movement'
      }),
      TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
        id: 'TEKS.K12.PE-K-PAH',
        code: 'TEKS.K12.PE-K-PAH',
        title: 'Physical activity and health'
      })
    ]
  });
  service.getDomains(subject, course)
    .then(function(domains) {
      assert.equal(domains.length, 2, 'Wrong number of domains');
      assert.equal(domains.objectAt(0).get('id'), 'TEKS.K12.PE-K-MOV', 'Wrong domain id');
      done();
    });
});
*/

/*

 TODO for David to CHECK

test('getCodes when taxonomy codes does not exist for domain', function(assert) {
  const test = this;
  const service = this.subject();
  service.set('apiTaxonomyService', Ember.Object.create({
    fetchCodes: function() {
      const codes = [
        TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
          id: 'TEKS.K12.PE-K-MOV-01',
          code: 'TEKS.PE.K.1',
          title: 'The student demonstrates competency in fundamental movement patterns and proficiency in a few specialized movement forms.',
          codeType: 'standard_level_1'
        }),
        TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
          id: 'TEKS.K12.PE-K-MOV-02',
          code: 'TEKS.PE.K.2',
          title: 'The student applies movement concepts and principles to the learning and development of motor skills.',
          codeType: 'standard_level_1'
        })
      ];
      return Ember.RSVP.resolve(codes);
    }
  }));
  var done = assert.async();
  const subject = TaxonomyRoot.create(Ember.getOwner(test).ownerInjection(), {
    id: 'GDF.K12.CS',
    frameworkId: 'GDF'
  });
  const course = TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
    id: 'TEKS.K12.PE-K',
    code: 'TEKS.K12.PE-K'
  });
  const domain = TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
    id: 'TEKS.K12.PE-K-MOV',
    code: 'TEKS.K12.PE-K-MOV',
    children: []
  });
  service.getCodes(subject, course, domain)
    .then(function(codes) {
      assert.equal(codes.length, 2, 'Wrong number of codes');
      assert.equal(codes.objectAt(0).id, 'TEKS.K12.PE-K-MOV-01', 'Wrong code id');
      done();
    });
});

test('getCodes when taxonomy codes exist for domain', function(assert) {
  const test = this;
  const service = this.subject();
  service.set('apiTaxonomyService', Ember.Object.create({
    fetchCodes: function() {
      assert.ok(false, 'Method fetchDomains() should not be called.');
      return Ember.RSVP.resolve([]);
    }
  }));
  var done = assert.async();
  const subject = TaxonomyRoot.create(Ember.getOwner(test).ownerInjection(), {
    id: 'GDF.K12.CS',
    frameworkId: 'GDF'
  });
  const course = TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
    id: 'TEKS.K12.PE-K',
    code: 'TEKS.K12.PE-K'
  });
  const domain = TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
    id: 'TEKS.K12.PE-K-MOV',
    code: 'TEKS.K12.PE-K-MOV',
    children: [
      TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
        id: 'TEKS.K12.PE-K-MOV-01',
        code: 'TEKS.PE.K.1',
        title: 'The student demonstrates competency in fundamental movement patterns and proficiency in a few specialized movement forms.',
        codeType: 'standard_level_1'
      }),
      TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
        id: 'TEKS.K12.PE-K-MOV-02',
        code: 'TEKS.PE.K.2',
        title: 'The student applies movement concepts and principles to the learning and development of motor skills.',
        codeType: 'standard_level_1'
      })
    ]
  });
  service.getCodes(subject, course, domain)
    .then(function(codes) {
      assert.equal(codes.length, 2, 'Wrong number of codes');
      assert.equal(codes.objectAt(0).id, 'TEKS.K12.PE-K-MOV-01', 'Wrong code id');
      done();
    });
});

test('organizeCodes', function(assert) {
  const test = this;
  const service = this.subject();
  const codes = [
    TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
      id: 'TEKS.K12.PE-K-MOV-01',
      code: 'TEKS.PE.K.1',
      title: 'The student demonstrates competency in fundamental movement patterns and proficiency in a few specialized movement forms.',
      codeType: 'standard_level_1'
    }),
    TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
      id: 'TEKS.K12.PE-K-MOV-01.01',
      code: 'TEKS.PE.K.1.A',
      title: 'Travel in different ways in a large group without bumping into others or falling.',
      parentTaxonomyCodeId: 'TEKS.K12.PE-K-MOV-01',
      codeType: 'standard_level_2'
    }),
    TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
      id: 'TEKS.K12.PE-K-MOV-01.02',
      code: 'TEKS.PE.K.1.B',
      title: 'Demonstrate clear contrasts between slow and fast movement when traveling.',
      parentTaxonomyCodeId: 'TEKS.K12.PE-K-MOV-01',
      codeType: 'standard_level_2'
    }),
    TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
      id: 'TEKS.K12.PE-K-MOV-01.03',
      code: 'TEKS.PE.K.1.C',
      title: 'Demonstrate non-locomotor (axial) movements such as bend and stretch.',
      parentTaxonomyCodeId: 'TEKS.K12.PE-K-MOV-01',
      codeType: 'standard_level_2'
    }),
    TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
      id: 'TEKS.K12.PE-K-MOV-01.01.01',
      code: 'TEKS.PE.K.1.C',
      title: 'Third level standard...',
      parentTaxonomyCodeId: 'TEKS.K12.PE-K-MOV-01.01',
      codeType: 'standard_level_3'
    }),
    TaxonomyItem.create(Ember.getOwner(test).ownerInjection(), {
      id: 'TEKS.K12.PE-K-MOV-01.01.02',
      code: 'TEKS.PE.K.1.C',
      title: 'Third level standard...',
      parentTaxonomyCodeId: 'TEKS.K12.PE-K-MOV-01.01',
      codeType: 'standard_level_3'
    })
  ];
  const organizedCodes = service.organizeCodes(codes)
  assert.equal(organizedCodes.length, 1, 'Wrong number of parent codes');
  assert.equal(organizedCodes.objectAt(0).get('id'), 'TEKS.K12.PE-K-MOV-01', 'Wrong parent code id');
  var childrenLevel2 = organizedCodes.objectAt(0).get('children');
  assert.equal(childrenLevel2.length, 3, 'Wrong number of children for level 2');
  assert.equal(childrenLevel2.objectAt(0).get('id'), 'TEKS.K12.PE-K-MOV-01.01', 'Wrong child level 2 code id');
  var childrenLevel3 = childrenLevel2.objectAt(0).get('children');
  assert.equal(childrenLevel3.length, 2, 'Wrong number of children for level 3');
  assert.equal(childrenLevel3.objectAt(0).get('id'), 'TEKS.K12.PE-K-MOV-01.01.01', 'Wrong child level 3 code id');
});
*/

test('findSubjectById for a loaded category and subject', function(assert) {
  const service = this.subject();
  const taxonomyContainer = {
    k_12: this.taxonomySubjects
  };

  service.set('taxonomyContainer', taxonomyContainer);

  var done = assert.async();
  service.findSubjectById('GDF.K12.VPA').then(function(subject) {
    assert.equal(subject.get('id'), 'GDF.K12.VPA', 'Invalid subject id');
    assert.equal(
      subject.get('frameworkId'),
      'GDF',
      'Invalid subject frameworkId'
    );
    service.findSubjectById('TEKS.K12.FA').then(function(framework) {
      assert.equal(framework.get('id'), 'TEKS.K12.FA', 'Invalid framework id');
      assert.equal(
        framework.get('frameworkId'),
        'TEKS',
        'Invalid framework frameworkId'
      );
      done();
    });
  });
});

test('findSubjectById for a loaded category and non-loaded subject', function(
  assert
) {
  const service = this.subject();
  const taxonomyContainer = {
    k_12: this.taxonomySubjects
  };

  service.set('taxonomyContainer', taxonomyContainer);

  const done = assert.async();
  service.findSubjectById('non-existing-subject-id').then(function(subject) {
    assert.equal(subject, null, 'Invalid subject. Should be null');
    done();
  });
});

// TODO Fix this!!
/*
test('findSubjectById for a non-loaded category', function(assert) {
  const test = this;
  const service = this.subject();
  const taxonomyContainer = {};

  service.set('taxonomyContainer', taxonomyContainer);
  service.set('apiTaxonomyService', Ember.Object.create({
    fetchSubjects: function() {
      return Ember.RSVP.resolve(test.taxonomySubjects);
    }
  }));

  var subject = service.findSubjectById('GDF.K12.VPA')
    .then(function(subject) {
      assert.equal(subject.get('id'), 'GDF.K12.VPA', 'Invalid subject id');
      assert.equal(subject.get('frameworkId'), 'GDF', 'Invalid subject frameworkId');
    });
});
*/

test('Create standards hierarchy -all in L0', function(assert) {
  const service = this.subject();

  const codes = [
    {
      id: '0A',
      code: 'C0A',
      title: 'Item 0A',
      codeType: 'standard_level_0'
    },
    {
      id: '0B',
      code: 'code_0B',
      title: 'Item 0B',
      codeType: 'standard_level_0'
    }
  ];

  var standards = service.createStandardsHierarchy(codes);
  assert.equal(standards.length, 3, 'Number of level 0 standards');
  assert.equal(standards[0].get('id'), '0A', 'ID');
  assert.equal(standards[0].get('code'), 'C0A', 'code');
  assert.equal(standards[0].get('title'), 'Item 0A', 'title');
  assert.equal(standards[0].get('level'), 3, 'level');
});

test('Create standards hierarchy -L1 with parent', function(assert) {
  const service = this.subject();

  const codes = [
    {
      id: '0A',
      code: 'C0A',
      title: 'Item 0A',
      codeType: 'standard_level_0'
    },
    {
      id: '0B',
      code: 'C0B',
      title: 'Item 0B',
      codeType: 'standard_level_0'
    },
    {
      id: '1A',
      code: 'C1A',
      title: 'Item 1A',
      parentTaxonomyCodeId: '0A',
      codeType: 'standard_level_1'
    },
    {
      id: '1B',
      code: 'C1B',
      title: 'Item 1B',
      parentTaxonomyCodeId: '0A',
      codeType: 'standard_level_1'
    }
  ];

  const standards = service.createStandardsHierarchy(codes);
  assert.equal(standards.length, 3, 'Number of level 0 standards');
  assert.equal(
    standards[0].get('children').length,
    2,
    'Number of level 1 standards'
  );

  const L1item = standards[0].get('children')[0];
  assert.equal(L1item.get('id'), '1A', 'ID');
  assert.equal(L1item.get('code'), 'C1A', 'code');
  assert.equal(L1item.get('title'), 'Item 1A', 'title');
  assert.equal(L1item.get('level'), 4, 'level');
});

test('Create standards hierarchy -L1 with/without parent', function(assert) {
  const service = this.subject();

  const codes = [
    {
      id: '0A',
      code: 'C0A',
      title: 'Item 0A',
      codeType: 'standard_level_0'
    },
    {
      id: '0B',
      code: 'C0B',
      title: 'Item 0B',
      codeType: 'standard_level_0'
    },
    {
      id: '1A',
      code: 'C1A',
      title: 'Item 1A',
      parentTaxonomyCodeId: '0A',
      codeType: 'standard_level_1'
    },
    {
      id: '1B',
      code: 'C1B',
      title: 'Item 1B',
      codeType: 'standard_level_1'
    }
  ];

  const standards = service.createStandardsHierarchy(codes);
  assert.equal(standards.length, 3, 'Number of level 0 standards');
  assert.equal(
    standards[0].get('children').length,
    1,
    'Number of level 1 standards'
  );
  assert.equal(
    standards[2].get('children').length,
    1,
    'Number of level 1 standards in default standard category'
  );

  const L1item = standards[0].get('children')[0];
  assert.equal(L1item.get('id'), '1A', 'ID');
  assert.equal(L1item.get('code'), 'C1A', 'code');
  assert.equal(L1item.get('title'), 'Item 1A', 'title');
  assert.equal(L1item.get('level'), 4, 'level');
});

test('Create standards hierarchy -one learning target', function(assert) {
  const service = this.subject();

  const codes = [
    {
      id: '0A',
      codeType: 'standard_level_0'
    },
    {
      id: '1A',
      parentTaxonomyCodeId: '0A',
      codeType: 'standard_level_1'
    },
    {
      id: '2A',
      parentTaxonomyCodeId: '1A',
      codeType: 'standard_level_2'
    },
    {
      id: '3A',
      parentTaxonomyCodeId: '2A',
      codeType: 'learning_target_level_0'
    }
  ];

  const standards = service.createStandardsHierarchy(codes);
  assert.equal(standards.length, 2, 'Number of level 0 standards');
  assert.equal(
    standards[0].get('children').length,
    1,
    'Number of level 1 standards'
  );

  const L1item = standards[0].get('children')[0];
  assert.equal(L1item.get('children').length, 1, 'Number of level 2 standards');

  const L2item = L1item.get('children')[0];
  assert.equal(L2item.get('children').length, 1, 'Number of learning targets');
});

test('Create standards hierarchy -multi-level learning targets', function(
  assert
) {
  const service = this.subject();

  const codes = [
    {
      id: '0A',
      codeType: 'standard_level_0'
    },
    {
      id: '1A',
      parentTaxonomyCodeId: '0A',
      codeType: 'standard_level_1'
    },
    {
      id: '2A',
      parentTaxonomyCodeId: '1A',
      codeType: 'standard_level_2'
    },
    {
      id: '3A',
      parentTaxonomyCodeId: '2A',
      codeType: 'learning_target_level_0'
    },
    {
      id: '4A',
      parentTaxonomyCodeId: '2A',
      codeType: 'learning_target_level_1'
    },
    {
      id: '4B',
      parentTaxonomyCodeId: '2A',
      codeType: 'learning_target_level_1'
    },
    {
      id: '5A',
      parentTaxonomyCodeId: '2A',
      codeType: 'learning_target_level_2'
    }
  ];

  const standards = service.createStandardsHierarchy(codes);
  assert.equal(standards.length, 2, 'Number of level 0 standards');
  assert.equal(
    standards[0].get('children').length,
    1,
    'Number of level 1 standards'
  );

  const L1item = standards[0].get('children')[0];
  assert.equal(L1item.get('children').length, 1, 'Number of level 2 standards');

  const L2item = L1item.get('children')[0];
  assert.equal(L2item.get('children').length, 4, 'Number of learning targets');
});
