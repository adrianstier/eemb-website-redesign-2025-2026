import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAlumniProfileAlumniProfile extends Schema.CollectionType {
  collectionName: 'alumni_profiles';
  info: {
    singularName: 'alumni-profile';
    pluralName: 'alumni-profiles';
    displayName: 'Alumni';
    description: 'Alumni directory with privacy controls';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    lastName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    graduationYear: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1960;
          max: 2030;
        },
        number
      >;
    degree: Attribute.Enumeration<['BS', 'BA', 'MS', 'MA', 'PhD']> &
      Attribute.Required;
    email: Attribute.Email & Attribute.Private;
    profileImage: Attribute.Media<'images'>;
    currentPosition: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    currentEmployer: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    location: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    bio: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    linkedIn: Attribute.String;
    website: Attribute.String;
    privacySettings: Attribute.Component<'shared.privacy-settings'> &
      Attribute.Required;
    spotlight: Attribute.Relation<
      'api::alumni-profile.alumni-profile',
      'oneToOne',
      'api::alumni-spotlight.alumni-spotlight'
    >;
    mentorAvailable: Attribute.Boolean & Attribute.DefaultTo<false>;
    mentorAreas: Attribute.JSON;
    classNotes: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    achievements: Attribute.JSON;
    slug: Attribute.UID<'api::alumni-profile.alumni-profile', 'fullName'>;
    fullName: Attribute.String;
    verified: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastUpdated: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::alumni-profile.alumni-profile',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::alumni-profile.alumni-profile',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAlumniSpotlightAlumniSpotlight
  extends Schema.CollectionType {
  collectionName: 'alumni_spotlights';
  info: {
    singularName: 'alumni-spotlight';
    pluralName: 'alumni-spotlights';
    displayName: 'Alumni Spotlight';
    description: 'Featured alumni stories and interviews';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    subtitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    alumniProfile: Attribute.Relation<
      'api::alumni-spotlight.alumni-spotlight',
      'oneToOne',
      'api::alumni-profile.alumni-profile'
    >;
    featuredImage: Attribute.Media<'images'> & Attribute.Required;
    publishDate: Attribute.Date & Attribute.Required;
    content: Attribute.RichText &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 10000;
      }>;
    excerpt: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    questionsAnswers: Attribute.Component<'shared.qa-pair', true>;
    careerHighlights: Attribute.JSON;
    adviceForStudents: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    tags: Attribute.JSON;
    slug: Attribute.UID<'api::alumni-spotlight.alumni-spotlight', 'title'>;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    relatedSpotlights: Attribute.Relation<
      'api::alumni-spotlight.alumni-spotlight',
      'oneToMany',
      'api::alumni-spotlight.alumni-spotlight'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::alumni-spotlight.alumni-spotlight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::alumni-spotlight.alumni-spotlight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCourseCourse extends Schema.CollectionType {
  collectionName: 'courses';
  info: {
    singularName: 'course';
    pluralName: 'courses';
    displayName: 'Course';
    description: 'Academic courses';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    courseCode: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    units: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 12;
        },
        number
      >;
    level: Attribute.Enumeration<['Undergraduate', 'Graduate', 'Both']> &
      Attribute.Required;
    instructor: Attribute.Relation<
      'api::course.course',
      'manyToOne',
      'api::faculty.faculty'
    >;
    coinstructors: Attribute.Relation<
      'api::course.course',
      'manyToMany',
      'api::faculty.faculty'
    >;
    quarter: Attribute.Enumeration<['Fall', 'Winter', 'Spring', 'Summer']>;
    year: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 2020;
          max: 2030;
        },
        number
      >;
    schedule: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    location: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    prerequisites: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    syllabus: Attribute.Media<'files'>;
    enrollmentCap: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    slug: Attribute.UID<'api::course.course', 'courseCode'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDeiContentDeiContent extends Schema.SingleType {
  collectionName: 'dei_contents';
  info: {
    singularName: 'dei-content';
    pluralName: 'dei-contents';
    displayName: 'DEI Content';
    description: 'Diversity, Equity, and Inclusion content';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Diversity, Equity & Inclusion'>;
    missionStatement: Attribute.RichText &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 3000;
      }>;
    commitmentMessage: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 3000;
      }>;
    committeeMembers: Attribute.Component<'shared.committee-member', true>;
    coChairs: Attribute.Relation<
      'api::dei-content.dei-content',
      'oneToMany',
      'api::faculty.faculty'
    >;
    initiatives: Attribute.Component<'shared.dei-initiative', true>;
    resources: Attribute.Component<'shared.dei-resource', true>;
    micrositeLink: Attribute.String;
    contactEmail: Attribute.Email;
    featuredImage: Attribute.Media<'images'>;
    lastUpdated: Attribute.Date;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::dei-content.dei-content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::dei-content.dei-content',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEventEvent extends Schema.CollectionType {
  collectionName: 'events';
  info: {
    singularName: 'event';
    pluralName: 'events';
    displayName: 'Event';
    description: 'Department events, seminars, and activities';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    eventType: Attribute.Enumeration<
      [
        'Seminar',
        'Workshop',
        'Conference',
        'Lecture',
        'Social',
        'Recruitment',
        'Defense',
        'Meeting',
        'Alumni Event',
        'Field Trip',
        'Other'
      ]
    > &
      Attribute.Required;
    startDate: Attribute.DateTime & Attribute.Required;
    endDate: Attribute.DateTime;
    allDay: Attribute.Boolean & Attribute.DefaultTo<false>;
    location: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    virtualLink: Attribute.String;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    shortDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    speaker: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    speakerTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    speakerAffiliation: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    speakerBio: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    speakerImage: Attribute.Media<'images'>;
    eventImage: Attribute.Media<'images'>;
    registrationRequired: Attribute.Boolean & Attribute.DefaultTo<false>;
    registrationLink: Attribute.String;
    registrationDeadline: Attribute.DateTime;
    maxAttendees: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    hostFaculty: Attribute.Relation<
      'api::event.event',
      'manyToOne',
      'api::faculty.faculty'
    >;
    tags: Attribute.JSON;
    slug: Attribute.UID<'api::event.event', 'title'>;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    recurring: Attribute.Boolean & Attribute.DefaultTo<false>;
    recurringPattern: Attribute.String;
    canceled: Attribute.Boolean & Attribute.DefaultTo<false>;
    cancelationReason: Attribute.Text;
    attachments: Attribute.Media<'files' | 'images', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::event.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::event.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFacultyFaculty extends Schema.CollectionType {
  collectionName: 'faculties';
  info: {
    singularName: 'faculty';
    pluralName: 'faculties';
    displayName: 'Faculty';
    description: 'Current faculty members';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: false;
    };
  };
  attributes: {
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    lastName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    title: Attribute.Enumeration<
      [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Professor Emeritus',
        'Distinguished Professor',
        'Research Professor',
        'Lecturer',
        'Teaching Professor'
      ]
    > &
      Attribute.Required;
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    phone: Attribute.String;
    office: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    profileImage: Attribute.Media<'images'>;
    bio: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    shortBio: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    researchInterests: Attribute.JSON;
    education: Attribute.Component<'shared.education', true>;
    publications: Attribute.Relation<
      'api::faculty.faculty',
      'manyToMany',
      'api::publication.publication'
    >;
    courses: Attribute.Relation<
      'api::faculty.faculty',
      'oneToMany',
      'api::course.course'
    >;
    labWebsite: Attribute.String;
    googleScholar: Attribute.String;
    orcid: Attribute.String;
    active: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    slug: Attribute.UID<'api::faculty.faculty', 'fullName'>;
    fullName: Attribute.String;
    department: Attribute.Enumeration<['EEMB', 'MCDB', 'Joint Appointment']> &
      Attribute.DefaultTo<'EEMB'>;
    researchAreas: Attribute.Relation<
      'api::faculty.faculty',
      'manyToMany',
      'api::research-area.research-area'
    >;
    joinedYear: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1960;
          max: 2030;
        },
        number
      >;
    officeHours: Attribute.String;
    photo_url: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::faculty.faculty',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::faculty.faculty',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGraduateStudentGraduateStudent
  extends Schema.CollectionType {
  collectionName: 'graduate_students';
  info: {
    singularName: 'graduate-student';
    pluralName: 'graduate-students';
    displayName: 'Graduate Student';
    description: 'PhD and MS graduate students';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    lastName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    fullName: Attribute.String;
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    phone: Attribute.String;
    office: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    profileImage: Attribute.Media<'images'>;
    photo_url: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    bio: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 3000;
      }>;
    shortBio: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    researchInterests: Attribute.JSON;
    degreeProgram: Attribute.Enumeration<['PhD', 'MS', 'Combined BS/MS']> &
      Attribute.Required;
    yearEntered: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 2000;
          max: 2030;
        },
        number
      >;
    expectedGraduation: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 2020;
          max: 2035;
        },
        number
      >;
    advisor: Attribute.Relation<
      'api::graduate-student.graduate-student',
      'manyToOne',
      'api::faculty.faculty'
    >;
    researchAreas: Attribute.Relation<
      'api::graduate-student.graduate-student',
      'manyToMany',
      'api::research-area.research-area'
    >;
    slug: Attribute.UID<'api::graduate-student.graduate-student', 'fullName'>;
    active: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    labWebsite: Attribute.String;
    personalWebsite: Attribute.String;
    googleScholar: Attribute.String;
    orcid: Attribute.String;
    twitter: Attribute.String;
    linkedin: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::graduate-student.graduate-student',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::graduate-student.graduate-student',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInMemoriamInMemoriam extends Schema.CollectionType {
  collectionName: 'in_memoriams';
  info: {
    singularName: 'in-memoriam';
    pluralName: 'in-memoriams';
    displayName: 'In Memoriam';
    description: 'Memorial pages for deceased faculty and community members';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    birthDate: Attribute.Date;
    passingDate: Attribute.Date & Attribute.Required;
    profileImage: Attribute.Media<'images'>;
    gallery: Attribute.Media<'images', true>;
    biography: Attribute.RichText &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 10000;
      }>;
    academicContributions: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    personalRemembrance: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    yearsAtEEMB: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    researchAreas: Attribute.JSON;
    majorAchievements: Attribute.Component<'shared.achievement', true>;
    quotes: Attribute.Component<'shared.memorial-quote', true>;
    externalLinks: Attribute.Component<'shared.external-link', true>;
    slug: Attribute.UID<'api::in-memoriam.in-memoriam', 'name'>;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    orderIndex: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::in-memoriam.in-memoriam',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::in-memoriam.in-memoriam',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNewsArticleNewsArticle extends Schema.CollectionType {
  collectionName: 'news_articles';
  info: {
    singularName: 'news-article';
    pluralName: 'news-articles';
    displayName: 'News Article';
    description: 'Good news, achievements, and department updates';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    subtitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    category: Attribute.Enumeration<
      [
        'Faculty Achievement',
        'Student Achievement',
        'Alumni Success',
        'Research Breakthrough',
        'Grant Award',
        'Department News',
        'Event',
        'Publication',
        'Media Coverage',
        'Partnership'
      ]
    > &
      Attribute.Required;
    featuredImage: Attribute.Media<'images'>;
    gallery: Attribute.Media<'images', true>;
    publishDate: Attribute.DateTime & Attribute.Required;
    author: Attribute.String & Attribute.DefaultTo<'EEMB Communications'>;
    content: Attribute.RichText &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 15000;
      }>;
    excerpt: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    relatedFaculty: Attribute.Relation<
      'api::news-article.news-article',
      'manyToMany',
      'api::faculty.faculty'
    >;
    relatedAlumni: Attribute.Relation<
      'api::news-article.news-article',
      'manyToMany',
      'api::alumni-profile.alumni-profile'
    >;
    externalLinks: Attribute.Component<'shared.external-link', true>;
    tags: Attribute.JSON;
    slug: Attribute.UID<'api::news-article.news-article', 'title'>;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    pinned: Attribute.Boolean & Attribute.DefaultTo<false>;
    relatedArticles: Attribute.Relation<
      'api::news-article.news-article',
      'oneToMany',
      'api::news-article.news-article'
    >;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::news-article.news-article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::news-article.news-article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPublicationPublication extends Schema.CollectionType {
  collectionName: 'publications';
  info: {
    singularName: 'publication';
    pluralName: 'publications';
    displayName: 'Publication';
    description: 'Research publications';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    authors: Attribute.Relation<
      'api::publication.publication',
      'manyToMany',
      'api::faculty.faculty'
    >;
    authorString: Attribute.Text;
    publicationType: Attribute.Enumeration<
      [
        'Journal Article',
        'Book',
        'Book Chapter',
        'Conference Paper',
        'Preprint',
        'Thesis',
        'Report',
        'Patent',
        'Dataset'
      ]
    > &
      Attribute.Required;
    journal: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    year: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1900;
          max: 2030;
        },
        number
      >;
    volume: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    issue: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    pages: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    doi: Attribute.String & Attribute.Unique;
    abstract: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    keywords: Attribute.JSON;
    pdfUrl: Attribute.String;
    pdfFile: Attribute.Media<'files'>;
    externalUrl: Attribute.String;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    openAccess: Attribute.Boolean & Attribute.DefaultTo<false>;
    impactFactor: Attribute.Decimal;
    citations: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    slug: Attribute.UID<'api::publication.publication', 'title'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::publication.publication',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::publication.publication',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiResearchAreaResearchArea extends Schema.CollectionType {
  collectionName: 'research_areas';
  info: {
    singularName: 'research-area';
    pluralName: 'research-areas';
    displayName: 'Research Area';
    description: 'Research areas and specializations';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    description: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    category: Attribute.Enumeration<
      [
        'Ecology',
        'Evolution',
        'Marine Biology',
        'Molecular Biology',
        'Conservation',
        'Climate Science',
        'Microbiology',
        'Genomics',
        'Physiology',
        'Biodiversity',
        'Other'
      ]
    >;
    icon: Attribute.Media<'images'>;
    faculty: Attribute.Relation<
      'api::research-area.research-area',
      'manyToMany',
      'api::faculty.faculty'
    >;
    slug: Attribute.UID<'api::research-area.research-area', 'name'>;
    featured: Attribute.Boolean & Attribute.DefaultTo<false>;
    orderIndex: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::research-area.research-area',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::research-area.research-area',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStaffStaff extends Schema.CollectionType {
  collectionName: 'staff_members';
  info: {
    singularName: 'staff';
    pluralName: 'staff-members';
    displayName: 'Staff';
    description: 'Department staff members';
  };
  options: {
    draftAndPublish: true;
    timestamps: true;
  };
  attributes: {
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    lastName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    fullName: Attribute.String;
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    phone: Attribute.String;
    office: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    profileImage: Attribute.Media<'images'>;
    photo_url: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    bio: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 3000;
      }>;
    shortBio: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    responsibilities: Attribute.JSON;
    department: Attribute.Enumeration<
      ['EEMB', 'MCDB', 'Administration', 'Shared']
    > &
      Attribute.DefaultTo<'EEMB'>;
    slug: Attribute.UID<'api::staff.staff', 'fullName'>;
    active: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    linkedin: Attribute.String;
    joinedYear: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1960;
          max: 2030;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::staff.staff',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::staff.staff',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::alumni-profile.alumni-profile': ApiAlumniProfileAlumniProfile;
      'api::alumni-spotlight.alumni-spotlight': ApiAlumniSpotlightAlumniSpotlight;
      'api::course.course': ApiCourseCourse;
      'api::dei-content.dei-content': ApiDeiContentDeiContent;
      'api::event.event': ApiEventEvent;
      'api::faculty.faculty': ApiFacultyFaculty;
      'api::graduate-student.graduate-student': ApiGraduateStudentGraduateStudent;
      'api::in-memoriam.in-memoriam': ApiInMemoriamInMemoriam;
      'api::news-article.news-article': ApiNewsArticleNewsArticle;
      'api::publication.publication': ApiPublicationPublication;
      'api::research-area.research-area': ApiResearchAreaResearchArea;
      'api::staff.staff': ApiStaffStaff;
    }
  }
}
