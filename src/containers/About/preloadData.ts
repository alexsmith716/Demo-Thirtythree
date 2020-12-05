//  import { Store } from 'redux';
//  import { isInfoAlertThreeLoaded, loadInfoAlertThree } from '../../redux/modules/infoAlertThree';
//  
//  async function preloadData(store: Store): Promise<any> {
//  	const infoLoaded = isInfoAlertThreeLoaded(store.getState().infoAlertThree);
//  	if (!infoLoaded) {
//  		await store.dispatch<any>(loadInfoAlertThree());
//  	}
//  }
//  
//  export { preloadData };

import { Store } from 'redux';
import { isInfoLoaded, loadInfo } from '../../redux/modules/info';
import { isInfoAlertLoaded, loadInfoAlert } from '../../redux/modules/infoAlert';

async function preloadData(store: Store): Promise<any> {
  const infoLoaded = isInfoLoaded(store.getState().info);
  if (!infoLoaded) {
    await store.dispatch<any>(loadInfo());
  }

  const infoAlertLoaded = isInfoAlertLoaded(store.getState().infoAlert);
  if (!infoAlertLoaded) {
    await store.dispatch<any>(loadInfoAlert());
  }
}

export { preloadData };
