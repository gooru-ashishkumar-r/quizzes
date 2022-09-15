Quizzes Addon Integration
=========================

# Installation

The `quizzes-addon` needs to be added to package.json as a dependency. The package can be provided in two different ways:

1. As an npm link, this is recommended for development as it can show the changes in the quizzes project really fast:
  - Download the quizzes repository (https://github.com/Gooru/quizzes)
  - In a terminal navigate to the quizzes folder
  - Execute the command `npm link`
  - Navigate to the Nile project folder
  - Execute the command `npm quizzes-addon`
2. As a tarball, this is recommended for production:
  - Download the quizzes repository (https://github.com/Gooru/quizzes)
  - In a terminal navigate to the quizzes folder
  - Executhe the command `npm pack`, this will create a file with the name `quizzes-addon-{QUIZZES_VERSION}.tgz`
  - Navigate to the Nile project folder
  - Execute the command `npm install <path to quizzes-addon-{QUIZZES_VERSION}.tgz>`

# Configuration
The quizzes addon is configured by setting the properties at the configuration initializer (initializers/configuration.js),
the application loads the properties from the default configuration or host configuration file.

For this Nile has to call the [mergeConfiguration](#quizzes-configuration) function from the `quizzes/configuration` service with the quizzes configuration as parameter.

# Sign in notification
Every time a new session is created the quizzes token and cdn url properties are updated accordingly. See instance-initializer/gooru-session-service.js#tokenObserver

# Route Integration
The quizzes routes can be accessed from `quizzes-addon/routes/<route-name>`.

Quizzes provides these routes:
  - player: assessment and collection player
  - reports/context: real-time dashboard for assessments
  - reports/student-context: summary student report for an assessment

The following steps are needed to integrate routes from quizzes:
  - Extend route
  - Provide the quizzes template name or create one taking the one from quizzes as base.
  - Set needed params and call `quizzesModel` in the `model`.
  - Add specific height to the container.

### Extend route
Instead of using Ember.Route to create a route use the corresponding route from quizzes, for example in the player route:

```
import QuizzesPlayer from 'quizzes-addon/routes/player';
export default QuizzesPlayer.extend();
```

### Template
Add the `templateName` property to the route with the name of the quizzes route as a string. Also a custom template could be provided but it needs to call the correct components to show what each route is intended to.

### Params and Model

In the model function for the route certain parameters need to be set and sent to the `quizzesModel` function for quizzes to function correctly.

  - The `player` route needs `profileId`, `role`, `type` and `contextId`.
  - The `reports/context` route needs `anonymous`, `type` and `contextId`.
  - The `reports/student-context` route needs `profileId`, `role`, `type` and `contextId`.

Notes:
  - `profileId` is Nile's current user `profileId`
  - The current user's `role` can take the value of `student` or `teacher`
  - `anonymous` can be `true` or `false`, it is used to activate anonymous mode.
  - `type` can be `collection` or `assessmnet`, it needs to be set according to the current object to be seen.
  - `contextId` is the id returned from calling [createContext](#quizzes-context) from quizzes, it needs to be called before calling `quizzesModel`.

# Service Integration
The quizzes services can be accessed by injecting an Ember service with the name `quizzes/<service-name>`.

Quizzes provides these services:
  - quizzes/configuration: used for different configuration options used in quizzes.
  - quizzes/context: used for managing quizzes contexts.

### Quizzes Configuration

#### mergeConfiguration(configuration)

It will set the properties from the configuration parameter as quizzes configuration.

The following is an example of what quizzes configuration should look like:

```
{
  "endpoint" : {
    "url": "http://nile-dev.gooru.org",
    "secureUrl": "https://nile-dev.gooru.org",
    "providerUrl": "http://nile-dev.gooru.org"
  },

  "realTime": {
    "webServiceUrl": "https://nile-dev.gooru.org",
    "webServiceUri": "/",
    "webSocketUrl": "https://nile-dev.gooru.org",
    "webSocketUri": "/ws/quizzes-realtime"
  }
}
```

#### setToken(token)

This will set the token for use by quizzes.

#### setCdnUrl(url)

This will set the cdnUrl for use by quizzes.

### Quizzes context

#### createContext(context)

It will create a context in quizzes and return an id in a JSON object:

```
{
  id: <context-id>
}
```

To create the parameter object the quizzes context model should be used, it can be imported from `quizzes-addon/models/context/context` and it can be created as any Ember model:

```
let context = QuizzesContext.create({
  collectionId: <collection-id>,
  title: <context-title>,
  isCollection: <is-collection>,
  classId: <class-id>,
  contextMapping: {
    courseId: <course-id>,
    unitId: <unit-id>,
    lessonId: <lesson-id>
  }
});
```

For teachers preview and anonymous player the context needs to be created without `classId` and `contextMapping`
```
let context = QuizzesContext.create({
  collectionId: <collection-id>,
  title: <context-title>,
  isCollection: <is-collection>
});
```

# Modal Integration
Quizzes modal needs to be added to the application template, i.e. `{{qz-modal}}`.

# Translations Integration
For each translations file, Nile needs to add the appropiate files from quizzes, i.e. `import quizzesTranslations from './quizzes/translations';`.

# CSS Integration
Style files from quizzes need to be imported in the main scss file for Nile, i.e. `@import 'quizzes';`.

# Tests
Quizzes has its own tests but for acceptance tests to pass for Nile, stubs for quizzes endpoints and a proxy in testem configuration need to be added:
```
"/quizzes": {
  "target": "http://localhost:8882"
}
```
