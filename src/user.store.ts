import * as fs from 'fs';
import {injectable} from "inversify";
import {ag} from "airgram";
import * as path from 'path';

const storePath = path.join(__dirname, '../user.store.json');

@injectable()
export default class JSONStore<DocT> implements ag.Store<DocT> {
  static debug = false;
  static storePath = storePath;
  static storeEncoding = 'utf8';
  static state: { [index:string] : any } = {};
  static busy: Promise<any> | null = null;
  static initialized = false;
  load () : Promise<any> {
    if (JSONStore.busy) {
      return JSONStore.busy.then(() => this.load())
    }

    JSONStore.busy = new Promise((resolve, reject) => {
      fs.readFile(JSONStore.storePath, JSONStore.storeEncoding, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // skip
          } else {
            return reject(err)
          }
        }
        try {
          if (data) {
            JSONStore.state = JSON.parse(data)
          } else {
            JSONStore.state = {};
          }
        } catch (e) {
          return reject(e)
        }
        JSONStore.initialized = true;
        JSONStore.busy = null;
        JSONStore.debug && console.log('JSONStore load()', JSONStore.state);
        resolve(JSONStore.state)
      });
    });

    return JSONStore.busy;
  }

  save () : Promise<any> {
    if (JSONStore.busy) {
      return JSONStore.busy.then(() => this.save())
    }

    JSONStore.busy = new Promise((resolve, reject) => {
      let data = '';
      try {
        data = JSON.stringify(JSONStore.state)
      } catch (e) {
        return reject(e)
      }
      fs.writeFile(JSONStore.storePath, data, JSONStore.storeEncoding, (err) => {
        if (err) return reject(err);
        JSONStore.busy = null;
        JSONStore.debug && console.log('JSONStore save()', data);
        resolve();
      });
    });

    return JSONStore.busy
  }

  public async delete (id: string): Promise<void> {
    if (!JSONStore.initialized) {
      return this.load().then(() => this.delete(id))
    }
    delete JSONStore.state[id];
    JSONStore.debug && console.log('JSONStore delete()', id);
    return this.save()
  }

  public async get (key: string, field?: string): Promise<any> {
    if (!JSONStore.initialized) {
      return this.load().then(() => this.get(key, field))
    }
    JSONStore.debug && console.log('JSONStore get()', key, field);
    if (field) {
      return Promise.resolve(JSONStore.state[key] && JSONStore.state[key][field])
    }
    return Promise.resolve(JSONStore.state[key])
  }

  public async set (id: string, doc: Partial<DocT>): Promise<Partial<DocT>> {
    if (!JSONStore.initialized) {
      return this.load().then(() => this.set(id, doc))
    }
    JSONStore.debug && console.log('JSONStore set()', id, doc);
    const nextDoc = JSONStore.state[id] ? Object.assign({}, JSONStore.state[id], doc) : doc;
    Object.assign(JSONStore.state, {
      [id]: nextDoc
    });
    return this.save().then(() => nextDoc)
  }
}