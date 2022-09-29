// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  centre:{
    lat:24.81949216575706,
    lng:46.73733048126165
  },
  radius:25,
  baseUrl:'https://localhost:44316',
  authority:"https://login.microsoftonline.com/166981dd-3c0c-41a1-acb5-20c80087960d",
  uiClienId: "b517f1d4-889c-4f5e-b98f-b99a857fb503",
  redirectUrl: "http://localhost:4200",
  postLogoutRedirectUri:"http://localhost:4200"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.