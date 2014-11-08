//
//  ViewController.swift
//  Wiwo
//
//  Created by Justin de Guzman on 10/31/14.
//  Copyright (c) 2014 wiwo. All rights reserved.
//

import UIKit
import CoreLocation
import AudioToolbox

class ViewController: UIViewController, CLLocationManagerDelegate, UITableViewDelegate,
UITableViewDataSource {
  @IBOutlet var storeLabel : UILabel!
  @IBOutlet var instructionLabel: UILabel!
  @IBOutlet var tableView: UITableView!
  @IBOutlet var logoImageView: UIImageView!
  
  var prices: [String: String] = ["coat": "90", "bag": "120"]
  
  var store = ""
  var products : [String] = []
  var halo = PulsingHaloLayer()
  var checkedOut = false
  
  // iBeacon setup
  let locationManager = CLLocationManager()
  let region = CLBeaconRegion(
    proximityUUID: NSUUID(UUIDString:"8492E75F-4FD6-469D-B132-043FE94921D8"),
    identifier: "Estimotes"
  )
  
  override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    var vc = segue.destinationViewController as UIViewController
    vc.modalPresentationStyle = UIModalPresentationStyle.OverCurrentContext
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()

    // add pulsing halo
    self.halo = PulsingHaloLayer()
    self.halo.position = self.view.center
    self.halo.radius = 100.0
    self.halo.backgroundColor = UIColor(red: 204.0/255.0, green: 55.0/255.0,
      blue: 15.0/255.0, alpha: 1.0).CGColor
    self.view.layer.addSublayer(self.halo)
    
    // change presentation banner
    JCNotificationCenter.sharedCenter().presenter =
      JCNotificationBannerPresenterIOS7Style()
    
    // initialize iBeacon usage
    locationManager.delegate = self
    if(CLLocationManager.authorizationStatus() !=
        CLAuthorizationStatus.AuthorizedWhenInUse) {
      locationManager.requestWhenInUseAuthorization()
    }
    locationManager.startRangingBeaconsInRegion(region)
  }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
  }
  
  func showNotificationBanner(title: NSString) {
    JCNotificationCenter.enqueueNotificationWithTitle(
      title, message: "", tapHandler: {})
  }
  
  func addProduct(item: NSString) {
    if (!contains(products, item) && self.store != "") {
      self.instructionLabel.hidden = true
      products.append(item)
      
      self.tableView.reloadData()
      AudioServicesPlayAlertSound(SystemSoundID(1016))
    }
  }
  
  func setStore(store: NSString) {
    if(self.store == "") {
      self.storeLabel.text = "Welcome to \(store)!"
      self.store = store
      
      AudioServicesPlayAlertSound(SystemSoundID(1031))
      
      UIView.animateWithDuration(0.3, animations: {
        self.storeLabel.alpha = 1.0
        self.instructionLabel.alpha = 1.0
      })
      
      UIView.animateWithDuration(0.4, animations: {
        self.logoImageView.frame = CGRectMake(self.logoImageView.frame.origin.x - 85, self.logoImageView.frame.origin.y - 195, self.logoImageView.frame.size.width / 2, self.logoImageView.frame.size.height / 2)
        }, completion: {
          (value: Bool) in
          self.halo.position = CGPoint(x: self.logoImageView.frame.origin.x + (self.logoImageView.frame.size.width / 2), y: self.logoImageView.frame.origin.y + (self.logoImageView.frame.size.height / 2))
          self.halo.radius = 80.0
          self.halo.backgroundColor = UIColor(red: 204.0/255.0, green: 55.0/255.0,
            blue: 15.0/255.0, alpha: 1.0).CGColor
          
      })
    } else if(self.products.count > 0 && !self.checkedOut) {
      self.checkedOut = true
      self.performSegueWithIdentifier("checkout", sender: self)
    }
  }
  
  func handleDevice(device: NSNumber) {
    switch device {
      // Billy's iPhone
      case 16192:
        self.addProduct("coat")
      
      // Robin's iPhone
      case 1012:
        self.addProduct("bag")
      
      // Magnus' iPad
      case 17963:
        self.setStore("Banana Republic")
      
      // Magnus' iPhone
      // case 12397:
      //   self.setStore("Banana Republic")
      
      default:
        break
    }
  }
  
  func locationManager(manager: CLLocationManager!, didRangeBeacons beacons:
    [AnyObject]!, inRegion region: CLBeaconRegion!) {
      let knownBeacons = beacons.filter{ $0.proximity != CLProximity.Unknown }
      
      if (knownBeacons.count > 0 && !self.checkedOut) {
        let closestBeacon = knownBeacons[0] as CLBeacon
        
        // show label only if proximity is less than 0.1m
        if(closestBeacon.accuracy < 0.3) {
          self.handleDevice(closestBeacon.minor)
        }
      }
  }
  
  /**
  * TableViewDataSource
  */
  
  @IBAction func deleteProduct(sender : AnyObject) {
    var button = sender as UIButton
    self.products.removeAtIndex(button.tag)
    tableView.reloadData()
    
    if(self.products.isEmpty) {
      self.instructionLabel.hidden = false
    }
  }
  
  func tableView(tableView: UITableView, numberOfRowsInSection section: Int)
    -> Int {
      return self.products.count
  }
  
  func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath:
    NSIndexPath) -> UITableViewCell {
      var cell:UITableViewCell =
      self.tableView.dequeueReusableCellWithIdentifier("cell")
        as UITableViewCell
      
      var imageView = cell.backgroundView as UIImageView
      imageView.image = UIImage(named:self.products[indexPath.row])
      cell.backgroundView = imageView
      cell.selectionStyle = UITableViewCellSelectionStyle.None;
      
      var containsButtonAlready = false
      var containsPriceAlready = false
      
      for view in cell.subviews as [UIView] {
        if let foundButton = view as? UIButton {
          if(foundButton.tag == indexPath.row) {
            containsButtonAlready = true
          }
        }
        
        if let foundLabel = view as? UILabel {
          if(foundLabel.tag == indexPath.row) {
            containsPriceAlready = true
          }
        }
      }
      
      if(!containsPriceAlready) {
        var label = UILabel(frame: CGRectMake(cell.frame.origin.x +
          cell.frame.width - 150, cell.frame.origin.y + 120, 80, 40))
        label.text = self.prices[self.products[indexPath.row]]
        label.backgroundColor = UIColor(red: 204.0/255.0, green: 55.0/255.0,
          blue: 15.0/255.0, alpha: 1.0)
        label.font = UIFont.boldSystemFontOfSize(30.0)
        label.textAlignment = NSTextAlignment.Center
        label.layer.cornerRadius = 5.0
        label.layer.masksToBounds = true
        label.textColor = UIColor.whiteColor()
        label.tag = indexPath.row
        cell.addSubview(label)
      }
      
      if(!containsButtonAlready) {
        var button = UIButton.buttonWithType(UIButtonType.System) as UIButton
        button.frame = CGRectMake(cell.frame.origin.x +
          cell.frame.width - 50, cell.frame.origin.y, 30, 30)
        button.setImage(UIImage(named: "close"), forState: UIControlState.Normal)
        button.tintColor = UIColor(red: 204.0/255.0, green: 55.0/255.0,
          blue: 15.0/255.0, alpha: 1.0)
        button.tag = indexPath.row
        button.addTarget(self, action:"deleteProduct:",
          forControlEvents: UIControlEvents.TouchUpInside)
        cell.addSubview(button)
      }
      
      return cell
  }
}
