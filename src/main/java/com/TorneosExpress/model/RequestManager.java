package com.TorneosExpress.model;

import java.util.ArrayList;
import java.util.List;

public class RequestManager<T> {
  private List<T> requests;

  public RequestManager(int size) {
    this.requests = new ArrayList<>(size);
  }

  public void addRequest(T requester) {
    requests.add(requester);
  }

  public void removeRequest(T requester) {
    requests.remove(requester);
  }
}
