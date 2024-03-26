package model.Guest;

public class LoginResult {
  private boolean success;

  public LoginResult() {
    this.success = false;
  }

  public void successful() {
    success = true;
  }

  public boolean isSuccess() {
    return success;
  }
}
