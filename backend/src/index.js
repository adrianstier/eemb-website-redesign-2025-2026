'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    // Add custom code here
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 EEMB Strapi backend is starting...');

    // Set up public permissions for faculty
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (publicRole) {
      const permissions = await strapi
        .query("plugin::users-permissions.permission")
        .findMany({
          where: {
            role: publicRole.id,
            action: ['api::faculty.faculty.find', 'api::faculty.faculty.findOne'],
          },
        });

      // Enable permissions for public access to faculty
      for (const permission of permissions) {
        await strapi
          .query("plugin::users-permissions.permission")
          .update({
            where: { id: permission.id },
            data: { enabled: true },
          });
      }
      console.log('✅ Faculty public permissions configured');
    }

    // Register lifecycle hooks for Faculty
    strapi.db.lifecycles.subscribe({
      models: ['api::faculty.faculty'],
      async beforeCreate(event) {
        const { data } = event.params;
        // Generate fullName for slug
        if (data.firstName && data.lastName) {
          data.fullName = `${data.firstName} ${data.lastName}`;
        }
      },
      async beforeUpdate(event) {
        const { data } = event.params;
        // Update fullName if names change
        if (data.firstName && data.lastName) {
          data.fullName = `${data.firstName} ${data.lastName}`;
        }
      },
    });

    // Register lifecycle hooks for Alumni
    strapi.db.lifecycles.subscribe({
      models: ['api::alumni-profile.alumni-profile'],
      async beforeCreate(event) {
        const { data } = event.params;
        // Generate fullName for slug
        if (data.firstName && data.lastName) {
          data.fullName = `${data.firstName} ${data.lastName}`;
        }
        // Set default privacy settings if not provided
        if (!data.privacySettings) {
          data.privacySettings = {
            showEmail: false,
            showPhone: false,
            showEmployer: true,
            showLocation: true,
            showLinkedIn: true,
            allowContact: false,
            visibility: 'public'
          };
        }
      },
      async beforeUpdate(event) {
        const { data } = event.params;
        // Update fullName if names change
        if (data.firstName && data.lastName) {
          data.fullName = `${data.firstName} ${data.lastName}`;
        }
        // Update lastUpdated
        data.lastUpdated = new Date();
      },
    });

    console.log('✅ EEMB Strapi backend is ready!');
  },
};