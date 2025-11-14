import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedAchievement extends Schema.Component {
  collectionName: 'components_shared_achievements';
  info: {
    displayName: 'Achievement';
    icon: 'trophy';
    description: 'Award or achievement';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    year: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1900;
          max: 2030;
        },
        number
      >;
    description: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    organization: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedCommitteeMember extends Schema.Component {
  collectionName: 'components_shared_committee_members';
  info: {
    displayName: 'Committee Member';
    icon: 'user-group';
    description: 'DEI committee member';
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    role: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    email: Attribute.Email;
    facultyMember: Attribute.Relation<
      'shared.committee-member',
      'oneToOne',
      'api::faculty.faculty'
    >;
  };
}

export interface SharedDeiInitiative extends Schema.Component {
  collectionName: 'components_shared_dei_initiatives';
  info: {
    displayName: 'DEI Initiative';
    icon: 'lightbulb';
    description: 'DEI initiative or program';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    status: Attribute.Enumeration<['Active', 'Planned', 'Completed']> &
      Attribute.DefaultTo<'Active'>;
    startDate: Attribute.Date;
    link: Attribute.String;
  };
}

export interface SharedDeiResource extends Schema.Component {
  collectionName: 'components_shared_dei_resources';
  info: {
    displayName: 'DEI Resource';
    icon: 'book';
    description: 'DEI resource or document';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    description: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    resourceType: Attribute.Enumeration<
      ['Document', 'Website', 'Video', 'Training', 'Policy', 'Report', 'Other']
    >;
    url: Attribute.String;
    file: Attribute.Media<'files'>;
  };
}

export interface SharedEducation extends Schema.Component {
  collectionName: 'components_shared_educations';
  info: {
    displayName: 'Education';
    icon: 'graduation-cap';
    description: 'Educational background';
  };
  attributes: {
    degree: Attribute.String & Attribute.Required;
    field: Attribute.String;
    institution: Attribute.String & Attribute.Required;
    year: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1900;
          max: 2030;
        },
        number
      >;
    thesis: Attribute.String;
    advisor: Attribute.String;
  };
}

export interface SharedExternalLink extends Schema.Component {
  collectionName: 'components_shared_external_links';
  info: {
    displayName: 'External Link';
    icon: 'link';
    description: 'External link with label';
  };
  attributes: {
    label: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    url: Attribute.String & Attribute.Required;
    openInNewTab: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface SharedMemorialQuote extends Schema.Component {
  collectionName: 'components_shared_memorial_quotes';
  info: {
    displayName: 'Memorial Quote';
    icon: 'quote';
    description: 'Memorial quote or remembrance';
  };
  attributes: {
    quote: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    author: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    authorTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    date: Attribute.Date;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'Meta Social';
    icon: 'share';
    description: 'Social media metadata';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    image: Attribute.Media<'images'>;
  };
}

export interface SharedPrivacySettings extends Schema.Component {
  collectionName: 'components_shared_privacy_settings';
  info: {
    displayName: 'Privacy Settings';
    icon: 'shield';
    description: 'Privacy controls for alumni profiles';
  };
  attributes: {
    showEmail: Attribute.Boolean & Attribute.DefaultTo<false>;
    showPhone: Attribute.Boolean & Attribute.DefaultTo<false>;
    showEmployer: Attribute.Boolean & Attribute.DefaultTo<true>;
    showLocation: Attribute.Boolean & Attribute.DefaultTo<true>;
    showLinkedIn: Attribute.Boolean & Attribute.DefaultTo<true>;
    allowContact: Attribute.Boolean & Attribute.DefaultTo<false>;
    visibility: Attribute.Enumeration<['public', 'alumni-only', 'private']> &
      Attribute.DefaultTo<'public'>;
  };
}

export interface SharedQaPair extends Schema.Component {
  collectionName: 'components_shared_qa_pairs';
  info: {
    displayName: 'Q&A Pair';
    icon: 'question';
    description: 'Question and answer pair for interviews';
  };
  attributes: {
    question: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    answer: Attribute.RichText &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 3000;
      }>;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
    description: 'SEO metadata';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    keywords: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    metaImage: Attribute.Media<'images'>;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    canonicalURL: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.achievement': SharedAchievement;
      'shared.committee-member': SharedCommitteeMember;
      'shared.dei-initiative': SharedDeiInitiative;
      'shared.dei-resource': SharedDeiResource;
      'shared.education': SharedEducation;
      'shared.external-link': SharedExternalLink;
      'shared.memorial-quote': SharedMemorialQuote;
      'shared.meta-social': SharedMetaSocial;
      'shared.privacy-settings': SharedPrivacySettings;
      'shared.qa-pair': SharedQaPair;
      'shared.seo': SharedSeo;
    }
  }
}
