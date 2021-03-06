// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CincoService } from '../services/cinco.service';
import { KeycloakService } from '../services/keycloak/keycloak.service';
import { ClaService } from '../services/cla.service';
import { HttpClient } from '../services/http-client';

import { AuthService } from '../services/auth.service';
import { AuthPage } from '../pages/auth/auth';
import { EnvConfig } from '../services/cla.env.utils';
import { LfxHeaderService } from '../services/lfx-header.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AuthPage;

  userRoles: any;
  pages: Array<{
    icon?: string;
    access: boolean;
    title: string;
    component: any;
  }>;

  users: any[];

  constructor(
    public platform: Platform,
    public app: App,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private cincoService: CincoService,
    private keycloak: KeycloakService,
    public claService: ClaService,
    public httpClient: HttpClient,
    public authService: AuthService,
    private lfxHeaderService: LfxHeaderService
  ) {
    this.getDefaults();
    this.initializeApp();

    this.mountHeader();
    this.mountFooter();

    // Determine if we're running in a local services (developer) mode - the USE_LOCAL_SERVICES environment variable
    // will be set to true, otherwise were using normal services deployed in each environment
    const localServicesMode = (process.env.USE_LOCAL_SERVICES || 'false').toLowerCase() === 'true';
    // Set true for local debugging using localhost (local ports set in claService)
    this.claService.isLocalTesting(localServicesMode);

    this.claService.setApiUrl(EnvConfig['cla-api-url']);
    this.claService.setHttp(httpClient);
  }

  mountHeader() {
    const script = document.createElement('script');
    script.setAttribute(
      'src',
      EnvConfig['lfx-header']
    );
    document.head.appendChild(script);
  }

  mountFooter() {
    const script = document.createElement('script');
    script.setAttribute(
      'src',
      EnvConfig['lfx-footer']
    );
    document.head.appendChild(script);
  }

  getDefaults() {
    this.pages = [];
    this.regeneratePagesMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Set the nav root so back button doesn't show
    this.nav.setRoot(page.component);
  }

  regeneratePagesMenu() {
    this.pages = [
      {
        title: 'All Companies',
        access: true,
        component: 'CompaniesPage'
      },
      {
        title: 'Sign Out',
        access: true,
        component: 'LogoutPage'
      }
    ];
  }
}
