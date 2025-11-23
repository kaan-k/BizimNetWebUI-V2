import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  activeTab: string = 'profile'; // Default to Profile

  // 1. PROFILE DATA
  userProfile = {
    name: 'Admin User',
    email: 'admin@aryyazilim.com',
    phone: '555 123 45 67',
    title: 'Sistem Yöneticisi',
    bio: 'Proje yönetimi ve teknik liderlik.',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=203b46&color=fff&size=128&bold=true'
  };

  // 2. SECURITY DATA
  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    sessionTimeout: 30 // minutes
  };

  // 3. DISPLAY DATA
  display = {
    theme: 'light',
    sidebarMode: 'fixed',
    density: 'comfortable',
    animations: true,
    stickyHeader: true
  };

  // 4. REGIONAL DATA
  regional = {
    language: 'tr',
    currency: 'TRY',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24',
    firstDayOfWeek: '1'
  };

  // 5. WORKFLOW DATA
  workflow = {
    autoSave: true,
    autoSaveInterval: 30,
    confirmDelete: true,
    defaultPriority: 'Orta',
    enableShortcuts: true,
       openInNewTab: false 
  };

  // 6. NOTIFICATIONS DATA
  notifications = {
    emailDigest: true,
    weeklyReport: true,
    taskAssignments: true,
    systemUpdates: false,
    marketing: false
  };

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  saveSettings() {
    // In a real app, you would map these objects to a DTO and send to API
    console.log('Saving all settings...');
    // Simulate API call
    setTimeout(() => alert('Ayarlar başarıyla güncellendi!'), 500);
  }
}