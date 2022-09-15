import { moduleFor, test } from 'ember-qunit';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';

moduleFor(
  'serializer:taxonomy/taxonomy',
  'Unit | Serializer | taxonomy/taxonomy'
);

test('normalizeFetchSubjects', function(assert) {
  const serializer = this.subject();
  const taxonomySubjectsPayload = {
    subjects: [
      {
        id: 'GDF.K12.VPA',
        title: 'Visual & Performing Arts',
        description: null,
        code: 'GDF.K12.VPA',
        standard_framework_id: 'GDF',
        frameworks: [
          {
            standard_framework_id: 'TEKS',
            taxonomy_subject_id: 'TEKS.K12.FA',
            taxonomy_subject_title: 'Fine Arts',
            title: 'Texas Essential Knowledge and Skills'
          }
        ]
      },
      {
        id: 'GDF.K12.HE',
        title: 'Health',
        description: null,
        code: 'GDF.K12.HE',
        standard_framework_id: 'GDF',
        frameworks: [
          {
            standard_framework_id: 'TEKS',
            taxonomy_subject_id: 'TEKS.K12.HE',
            taxonomy_subject_title: 'Health Education',
            title: 'Texas Essential Knowledge and Skills'
          }
        ]
      },
      {
        id: 'GDF.K12.CS',
        title: 'Computer Science',
        description: null,
        code: 'GDF.K12.CS',
        standard_framework_id: 'GDF'
      },
      {
        id: 'GDF.K12.PF',
        title: 'Personal Finance',
        description: null,
        code: 'GDF.K12.PF',
        standard_framework_id: 'GDF'
      }
    ]
  };
  const normalizedSubjects = serializer.normalizeFetchSubjects(
    taxonomySubjectsPayload
  );
  assert.equal(normalizedSubjects.length, 4, 'Wrong number of subjects');
  const subject1 = normalizedSubjects.objectAt(0);
  assert.equal(subject1.get('id'), 'GDF.K12.VPA', 'Wrong subject id');
  assert.equal(subject1.get('frameworkId'), 'GDF', 'Wrong subject frameworkId');
  assert.equal(
    subject1.get('title'),
    'Visual & Performing Arts',
    'Wrong subject title'
  );
  assert.equal(
    subject1.get('subjectTitle'),
    'Visual & Performing Arts',
    'Wrong subject subjectTitle'
  );
  assert.equal(subject1.get('code'), 'GDF.K12.VPA', 'Wrong subject code');
  const frameworks = subject1.get('frameworks');
  assert.equal(frameworks.length, 1, 'Wrong number of frameworks');
  const framework1 = frameworks.objectAt(0);
  assert.equal(framework1.get('id'), 'TEKS.K12.FA', 'Wrong framework id');
  assert.equal(
    framework1.get('frameworkId'),
    'TEKS',
    'Wrong framework frameworkId'
  );
  assert.equal(
    framework1.get('title'),
    'Texas Essential Knowledge and Skills',
    'Wrong framework title'
  );
  assert.equal(
    framework1.get('subjectTitle'),
    'Visual & Performing Arts',
    'Wrong framework subjectTitle'
  );
  assert.equal(
    framework1.get('frameworks.length'),
    0,
    'Wrong number of frameworks'
  );
});

test('normalizeFetchCourses', function(assert) {
  const serializer = this.subject();
  const taxonomyCoursesPayload = {
    courses: [
      {
        id: 'TEKS.K12.PE-K',
        code: 'TEKS.K12.PE-K',
        title: 'Kindergarten'
      },
      {
        id: 'TEKS.K12.PE-1',
        code: 'TEKS.K12.PE-1',
        title: 'Grade 1'
      },
      {
        id: 'TEKS.K12.PE-2',
        code: 'TEKS.K12.PE-2',
        title: 'Grade 2'
      },
      {
        id: 'TEKS.K12.PE-3',
        code: 'TEKS.K12.PE-3',
        title: 'Grade 3'
      }
    ]
  };
  const normalizedCourses = serializer.normalizeFetchCourses(
    taxonomyCoursesPayload
  );
  assert.equal(normalizedCourses.length, 4, 'Wrong number of courses');
  const course1 = normalizedCourses.objectAt(0);
  assert.equal(course1.get('id'), 'TEKS.K12.PE-K', 'Wrong course id');
  assert.equal(course1.get('title'), 'Kindergarten', 'Wrong course title');
  assert.equal(course1.get('code'), 'TEKS.K12.PE-K', 'Wrong course code');
});

test('normalizeFetchDomains', function(assert) {
  const serializer = this.subject();
  const taxonomyDomainsPayload = {
    domains: [
      {
        id: 'TEKS.K12.PE-K-MOV',
        code: 'TEKS.K12.PE-K-MOV',
        title: 'Movement'
      },
      {
        id: 'TEKS.K12.PE-K-PAH',
        code: 'TEKS.K12.PE-K-PAH',
        title: 'Physical activity and health'
      },
      {
        id: 'TEKS.K12.PE-K-SD',
        code: 'TEKS.K12.PE-K-SD',
        title: 'Social development'
      }
    ]
  };
  const normalizedDomains = serializer.normalizeFetchDomains(
    taxonomyDomainsPayload
  );
  assert.equal(normalizedDomains.length, 3, 'Wrong number of domains');
  const domain1 = normalizedDomains.objectAt(0);
  assert.equal(domain1.get('id'), 'TEKS.K12.PE-K-MOV', 'Wrong domain id');
  assert.equal(domain1.get('title'), 'Movement', 'Wrong domain title');
  assert.equal(domain1.get('code'), 'TEKS.K12.PE-K-MOV', 'Wrong domain code');
});

test('normalizeFetchCodes', function(assert) {
  const serializer = this.subject();
  const taxonomyCodesPayload = {
    codes: [
      {
        id: 'TEKS.K12.PE-K-MOV-01.01',
        parent_taxonomy_code_id: 'TEKS.K12.PE-K-MOV-01',
        code: 'TEKS.PE.K.1.A',
        title:
          'Travel in different ways in a large group without bumping into others or falling.',
        code_type: 'standard_level_2',
        is_selectable: false
      },
      {
        id: 'TEKS.K12.PE-K-MOV-02.01',
        parent_taxonomy_code_id: 'TEKS.K12.PE-K-MOV-02',
        code: 'TEKS.PE.K.2.A',
        title:
          'Identify selected body parts such as head, back, chest, waist, hips, arms, elbows, wrists, hands, fingers, legs, knees, ankles, feet, and toes.',
        code_type: 'standard_level_2',
        is_selectable: false
      },
      {
        id: 'TEKS.K12.PE-K-MOV-01',
        code: 'TEKS.PE.K.1',
        title:
          'The student demonstrates competency in fundamental movement patterns and proficiency in a few specialized movement forms.',
        code_type: 'standard_level_1',
        is_selectable: false
      },
      {
        id: 'TEKS.K12.PE-K-MOV-02.02',
        parent_taxonomy_code_id: 'TEKS.K12.PE-K-MOV-02',
        code: 'TEKS.PE.K.2.B',
        title:
          'Demonstrate movement forms of various body parts such as head flexion, extension, and rotation.',
        code_type: 'standard_level_2',
        is_selectable: false
      }
    ]
  };
  const normalizedCodes = serializer.normalizeFetchCodes(taxonomyCodesPayload);
  assert.equal(normalizedCodes.length, 4, 'Wrong number of codes');
  const code1 = normalizedCodes.objectAt(0);
  assert.equal(code1.id, 'TEKS.K12.PE-K-MOV-01.01', 'Wrong code id');
  assert.equal(
    code1.title,
    'Travel in different ways in a large group without bumping into others or falling.',
    'Wrong code title'
  );
  assert.equal(code1.code, 'TEKS.PE.K.1.A', 'Wrong code code');
  assert.equal(
    code1.parentTaxonomyCodeId,
    'TEKS.K12.PE-K-MOV-01',
    'Wrong code parentTaxonomyCodeId'
  );
  assert.equal(code1.codeType, 'standard_level_2', 'Wrong code codeType');
});

test('serializeTaxonomy', function(assert) {
  const serializer = this.subject();
  const taxonomyData = [
    TaxonomyTagData.create({
      id: 'GDF.K12.VPA',
      code: 'GDF.K12.VPA',
      title: 'Visual & Performing Arts',
      parentTitle: '',
      description: '',
      frameworkCode: 'GDF'
    }),
    TaxonomyTagData.create({
      id: 'TEKS.K12.FA',
      code: 'TEKS.K12.FA',
      title: 'Texas Essential Knowledge and Skills',
      parentTitle: 'Visual & Performing Arts',
      description: '',
      frameworkCode: 'TEKS'
    })
  ];
  const serializedTaxonomy = serializer.serializeTaxonomy(taxonomyData);
  const taxonomySubject = serializedTaxonomy['GDF.K12.VPA'];
  assert.equal(taxonomySubject.code, 'GDF.K12.VPA', 'Wrong subject code');
  assert.equal(
    taxonomySubject.title,
    'Visual & Performing Arts',
    'Wrong subject title'
  );
  assert.equal(
    taxonomySubject.framework_code,
    'GDF',
    'Wrong subject framework_code'
  );
  const taxonomyFramework = serializedTaxonomy['TEKS.K12.FA'];
  assert.equal(taxonomyFramework.code, 'TEKS.K12.FA', 'Wrong framework code');
  assert.equal(
    taxonomyFramework.title,
    'Texas Essential Knowledge and Skills',
    'Wrong framework title'
  );
  assert.equal(
    taxonomyFramework.parent_title,
    'Visual & Performing Arts',
    'Wrong framework parent_title'
  );
  assert.equal(
    taxonomyFramework.framework_code,
    'TEKS',
    'Wrong framework framework_code'
  );
});

test('normalizeTaxonomyObject', function(assert) {
  const serializer = this.subject();
  const taxonomyJSON = {
    'GDF.K12.VPA': {
      code: 'GDF.K12.VPA',
      title: 'Visual & Performing Arts',
      parent_title: '',
      description: '',
      framework_code: 'GDF'
    },
    'TEKS.K12.FA': {
      code: 'TEKS.K12.FA',
      title: 'Texas Essential Knowledge and Skills',
      parent_title: 'Visual & Performing Arts',
      description: '',
      framework_code: 'TEKS'
    }
  };
  const normalizedTaxonomy = serializer.normalizeTaxonomyObject(taxonomyJSON);
  assert.equal(normalizedTaxonomy.length, 2, 'Wrong taxonomy elements');
  const taxonomySubject = normalizedTaxonomy.objectAt(0);
  assert.equal(
    taxonomySubject.get('code'),
    'GDF.K12.VPA',
    'Wrong subject code'
  );
  assert.equal(
    taxonomySubject.get('title'),
    'Visual & Performing Arts',
    'Wrong subject title'
  );
  assert.equal(
    taxonomySubject.get('frameworkCode'),
    'GDF',
    'Wrong subject frameworkCode'
  );
  const taxonomyFramework = normalizedTaxonomy.objectAt(1);
  assert.equal(
    taxonomyFramework.get('code'),
    'TEKS.K12.FA',
    'Wrong framework code'
  );
  assert.equal(
    taxonomyFramework.get('title'),
    'Texas Essential Knowledge and Skills',
    'Wrong framework title'
  );
  assert.equal(
    taxonomyFramework.get('parentTitle'),
    'Visual & Performing Arts',
    'Wrong framework parentTitle'
  );
  assert.equal(
    taxonomyFramework.get('frameworkCode'),
    'TEKS',
    'Wrong framework frameworkCode'
  );
});

test('normalizeTaxonomyArray', function(assert) {
  const serializer = this.subject();
  const taxonomyJSON = [
    {
      internalCode: 'GDF.K12.VPA',
      code: 'GDF.K12.VPA',
      title: 'Visual & Performing Arts',
      parentTitle: '',
      description: '',
      frameworkCode: 'GDF'
    },
    {
      internalCode: 'TEKS.K12.FA',
      code: 'TEKS.K12.FA',
      title: 'Texas Essential Knowledge and Skills',
      parentTitle: 'Visual & Performing Arts',
      description: '',
      frameworkCode: 'TEKS'
    }
  ];

  const normalizedTaxonomy = serializer.normalizeTaxonomyArray(taxonomyJSON);
  assert.equal(normalizedTaxonomy.length, 2, 'Wrong taxonomy elements');
  const taxonomyDataA = normalizedTaxonomy.objectAt(0);
  assert.equal(taxonomyDataA.get('code'), 'GDF.K12.VPA', 'Wrong subject code');
  assert.equal(
    taxonomyDataA.get('title'),
    'Visual & Performing Arts',
    'Wrong subject title'
  );
  assert.equal(
    taxonomyDataA.get('frameworkCode'),
    'GDF',
    'Wrong subject frameworkCode'
  );
  const taxonomyDataB = normalizedTaxonomy.objectAt(1);
  assert.equal(
    taxonomyDataB.get('code'),
    'TEKS.K12.FA',
    'Wrong framework code'
  );
  assert.equal(
    taxonomyDataB.get('title'),
    'Texas Essential Knowledge and Skills',
    'Wrong framework title'
  );
  assert.equal(
    taxonomyDataB.get('parentTitle'),
    'Visual & Performing Arts',
    'Wrong framework parentTitle'
  );
  assert.equal(
    taxonomyDataB.get('frameworkCode'),
    'TEKS',
    'Wrong framework frameworkCode'
  );
});
