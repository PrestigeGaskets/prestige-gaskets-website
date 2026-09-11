package com.prestigegaskets.rushmore.config;

import com.prestigegaskets.rushmore.service.MasterSyncService;
import com.prestigegaskets.rushmore.service.WorkforceService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

  private final MasterSyncService masterSync;
  private final WorkforceService workforce;

  public DataSeeder(MasterSyncService masterSync, WorkforceService workforce) {
    this.masterSync = masterSync;
    this.workforce = workforce;
  }

  @Override
  public void run(ApplicationArguments args) {
    masterSync.ensureSeeded();
    workforce.ensureSeeded();
  }
}
