package com.huawei.showcase.common.util.log;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.RollingFileAppender;
import org.apache.log4j.helpers.CountingQuietWriter;
import org.apache.log4j.helpers.LogLog;

import com.huawei.showcase.common.util.CommonUtils;

public class HRollingFileAppender extends RollingFileAppender
{
  public static  String LOG_PATH = System.getProperty("WIDemo.LOGHOME");
  
  static{
	  if(LOG_PATH==null || LOG_PATH.isEmpty()){
		  LOG_PATH = CommonUtils.getProjAbsolutePath()+System.getProperty("file.separator")+"WEB-INF/wi";
	  }
  }
  
  public static final String LOG_HOME = LOG_PATH + "/logs/log";
  public static final String LOG_BACKUP_HOME = LOG_PATH + System.getProperty("file.separator") + "logs/backup";


  private static ReentrantLock lock = new ReentrantLock();

  private static boolean isLogBackUped = false;

  public HRollingFileAppender()
  {
    try
    {
      lock.lock();
      this.setFile(LOG_HOME+"/VDESKTOP/webui.log");
    
      if (!isLogBackUped)
      {
        File logFolder = new File(LOG_HOME);

        if (logFolder.exists())
        {
          Date date = new Date();
          SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
          String dateString = sdf.format(date);
          String backupFolderPath = LOG_BACKUP_HOME + "/log_" + dateString;
          Set<String> logFolders = new HashSet<String>();
          listLastFolders(logFolders, logFolder);
          
          File logHomeFolder = new File(LOG_HOME);
          File backupFolder = new File(backupFolderPath);
          
          copyDirectory(logHomeFolder, backupFolder);
          zipFolder(backupFolder, backupFolderPath + ".zip");
          deleteUselessFolder();

          for (String logFolderPath : logFolders)
          {
            deleteAllLogFiles(new File(logFolderPath));
          }
        }

        isLogBackUped = true;
      }
    }
    finally
    {
      lock.unlock();
    }
  }

  private void copyDirectory(File srcFolder, File destFolder)
  {
    try
    {
      FileUtils.copyDirectory(srcFolder, destFolder);
    }
    catch (IOException e)
    {
      LogLog.error("back up failed", e);
    }
  }

  private void deleteAllLogFiles(File logFolder)
  {
    File[] files = logFolder.listFiles();

    if (files == null)
    {
      return;
    }

    for (File file : files)
    {
      if (file.isDirectory())
      {
        deleteAllLogFiles(file);
      }
      else
      {
        try
        {
          FileUtils.forceDelete(file);
        }
        catch (IOException e)
        {
          LogLog.error("Delete log files failed. fileName=" + file.getName());
        }
      }
    }
  }

  private void deleteFolder(File file)
  {
    if (file == null)
    {
      LogLog.error("file is null");
      return;
    }
    if (file.exists())
    {
      try
      {
        if (file.isFile())
        {
          if (!file.delete())
          {
            LogLog.error("file delete error");
          }
        }
        else if (file.isDirectory())
        {
          File[] files = file.listFiles();
          if (files == null)
          {
            LogLog.error("file is null");
            return;
          }

          for (int i = 0; i < files.length; i++)
          {
            if (files[i] != null)
            {
              deleteFolder(files[i]);
            }
          }

          if (!file.delete())
          {
            LogLog.error("file delete error");
          }
        }
      }
      catch (RuntimeException e)
      {
        LogLog.error("delete Folder failed", e);
      }
    }
    else
    {
      LogLog.error("file not exist!");
    }
  }

  private void listLastFolders(Set<String> folderList, File rootFolder)
  {
    File[] files = rootFolder.listFiles();

    if (files == null)
    {
      return;
    }

    for (File file : files)
    {
      if (file.isDirectory())
      {
        listLastFolders(folderList, file);
      }
      else if (file.getParentFile().getAbsolutePath() != null)
      {
        folderList.add(file.getParentFile().getAbsolutePath());
      }
    }
  }

  public synchronized void setFile(String fileName, boolean append, boolean bufferedIO, int bufferSize)
    throws IOException
  {
    File file = new File(fileName);

    File parentFolder = file.getParentFile();
    if ((parentFolder != null) && (!parentFolder.exists()))
    {
      if (!parentFolder.mkdirs())
      {
        LogLog.error("Make log directorys failed.");
      }
    }

    super.setFile(fileName, append, bufferedIO, bufferSize);
  }

  public void rollOver()
  {
    LogLog.debug("rolling over count=" + ((CountingQuietWriter)this.qw).getCount());
    LogLog.debug("maxBackupIndex=" + this.maxBackupIndex);

    if (this.maxBackupIndex > 0)
    {
      File file = new File(this.fileName + '.' + this.maxBackupIndex);
      if (file.exists())
      {
        backupLog();
        deleteUselessFolder();
      }

      for (int i = this.maxBackupIndex - 1; i >= 1; i--)
      {
        file = new File(this.fileName + "." + i);
        if (file.exists())
        {
          File target = new File(this.fileName + '.' + (i + 1));
          LogLog.debug("Renaming file " + file + " to " + target);
          if (!file.renameTo(target))
          {
            LogLog.error("rename log file failed, fileName=" + file.getName());
          }
        }

      }

      File target = new File(this.fileName + "." + 1);

      closeFile();

      file = new File(this.fileName);
      LogLog.debug("Renaming file " + file + " to " + target);

      if (!file.renameTo(target))
      {
        LogLog.error("rename log file failed, fileName=" + file.getName());
      }

    }

    try
    {
      setFile(this.fileName, false, this.bufferedIO, this.bufferSize);
    }
    catch (IOException e)
    {
      LogLog.error("setFile(" + this.fileName + ", false) call failed.", e);
    }
  }

  private void backupLog()
  {
    LogLog.debug("The count of log files is more than " + this.maxBackupIndex + ", then back up them.");

    Date date = new Date();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
    String dateString = sdf.format(date);

    String backupFolderPath = LOG_BACKUP_HOME + "/log_" + dateString + "/" + this.name;
    File backupFolder = new File(backupFolderPath);

    backUp(backupFolder);
    zipFolder(backupFolder, LOG_BACKUP_HOME + "/log_" + dateString + ".zip");
  }

  private void backUp(File backupFolder)
  {
    File file = null;

    for (int i = 1; i <= this.maxBackupIndex; i++)
    {
      file = new File(this.fileName + '.' + i);
      try
      {
        FileUtils.moveToDirectory(file, backupFolder, true);
      }
      catch (IOException e)
      {
        LogLog.error("Renaming file " + file + " to " + backupFolder.getAbsolutePath() + " failed", e);
      }
    }
  }

  private void zipFolder(File backupFolder, String zipFile)
  {
    ZipCompressor.zipFolder(backupFolder.getAbsolutePath(), zipFile);
  }

  private synchronized void deleteUselessFolder()
  {
    String backupFolderPath = LOG_BACKUP_HOME;

    File home = new File(backupFolderPath);

    File[] files = home.listFiles(new FileFilter()
    {
      public boolean accept(File pathname)
      {
        if (!pathname.isDirectory())
        {
          return false;
        }

        return true;
      }
    });
    if ((files == null) || (files.length == 0))
    {
      return;
    }

    for (File file : files)
    {
      deleteFolder(file);
    }
  }
}