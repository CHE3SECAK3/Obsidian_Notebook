    var __importDefault = exports && exports.__importDefault || function(mod) {
    var debug_1 = __importDefault(require_browser());
          var Reflect = global2.Reflect;
          module3.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
async function shasum(buffer2) {
  if (supportsSubtleSHA1 === null) {
    supportsSubtleSHA1 = await testSubtleSHA1();
  }
  return supportsSubtleSHA1 ? subtleSHA1(buffer2) : shasumSync(buffer2);
async function subtleSHA1(buffer2) {
  const hash2 = await crypto.subtle.digest("SHA-1", buffer2);
  return toHex(hash2);
async function testSubtleSHA1() {
  try {
    const hash2 = await subtleSHA1(new Uint8Array([]));
    if (hash2 === "da39a3ee5e6b4b0d3255bfef95601890afd80709")
      return true;
  } catch (_) {
  }
  return false;
  static async from(buffer2) {
    if (Buffer2.isBuffer(buffer2)) {
      return GitIndex.fromBuffer(buffer2);
    } else if (buffer2 === null) {
      return new GitIndex(null);
    } else {
      throw new InternalError("invalid type passed to GitIndex.from");
    }
  static async fromBuffer(buffer2) {
    const shaComputed = await shasum(buffer2.slice(0, -20));
    const shaClaimed = buffer2.slice(-20).toString("hex");
    if (shaClaimed !== shaComputed) {
      throw new InternalError(`Invalid checksum in GitIndex buffer: expected ${shaClaimed} but saw ${shaComputed}`);
    }
    const reader = new BufferCursor(buffer2);
    const _entries = new Map();
    const magic = reader.toString("utf8", 4);
    if (magic !== "DIRC") {
      throw new InternalError(`Inavlid dircache magic file number: ${magic}`);
    }
    const version2 = reader.readUInt32BE();
    if (version2 !== 2) {
      throw new InternalError(`Unsupported dircache version: ${version2}`);
    }
    const numEntries = reader.readUInt32BE();
    let i = 0;
    while (!reader.eof() && i < numEntries) {
      const entry = {};
      entry.ctimeSeconds = reader.readUInt32BE();
      entry.ctimeNanoseconds = reader.readUInt32BE();
      entry.mtimeSeconds = reader.readUInt32BE();
      entry.mtimeNanoseconds = reader.readUInt32BE();
      entry.dev = reader.readUInt32BE();
      entry.ino = reader.readUInt32BE();
      entry.mode = reader.readUInt32BE();
      entry.uid = reader.readUInt32BE();
      entry.gid = reader.readUInt32BE();
      entry.size = reader.readUInt32BE();
      entry.oid = reader.slice(20).toString("hex");
      const flags = reader.readUInt16BE();
      entry.flags = parseCacheEntryFlags(flags);
      const pathlength = buffer2.indexOf(0, reader.tell() + 1) - reader.tell();
      if (pathlength < 1) {
        throw new InternalError(`Got a path length of: ${pathlength}`);
      }
      entry.path = reader.toString("utf8", pathlength);
      if (entry.path.includes("..\\") || entry.path.includes("../")) {
        throw new UnsafeFilepathError(entry.path);
      }
      let padding = 8 - (reader.tell() - 12) % 8;
      if (padding === 0)
        padding = 8;
      while (padding--) {
        const tmp = reader.readUInt8();
        if (tmp !== 0) {
          throw new InternalError(`Expected 1-8 null characters but got '${tmp}' after ${entry.path}`);
        } else if (reader.eof()) {
          throw new InternalError("Unexpected end of file");
        }
      }
      _entries.set(entry.path, entry);
      i++;
    }
    return new GitIndex(_entries);
  async toObject() {
    const header = Buffer2.alloc(12);
    const writer = new BufferCursor(header);
    writer.write("DIRC", 4, "utf8");
    writer.writeUInt32BE(2);
    writer.writeUInt32BE(this.entries.length);
    const body = Buffer2.concat(this.entries.map((entry) => {
      const bpath = Buffer2.from(entry.path);
      const length = Math.ceil((62 + bpath.length + 1) / 8) * 8;
      const written = Buffer2.alloc(length);
      const writer2 = new BufferCursor(written);
      const stat = normalizeStats(entry);
      writer2.writeUInt32BE(stat.ctimeSeconds);
      writer2.writeUInt32BE(stat.ctimeNanoseconds);
      writer2.writeUInt32BE(stat.mtimeSeconds);
      writer2.writeUInt32BE(stat.mtimeNanoseconds);
      writer2.writeUInt32BE(stat.dev);
      writer2.writeUInt32BE(stat.ino);
      writer2.writeUInt32BE(stat.mode);
      writer2.writeUInt32BE(stat.uid);
      writer2.writeUInt32BE(stat.gid);
      writer2.writeUInt32BE(stat.size);
      writer2.write(entry.oid, 20, "hex");
      writer2.writeUInt16BE(renderCacheEntryFlags(entry));
      writer2.write(entry.path, bpath.length, "utf8");
      return written;
    }));
    const main = Buffer2.concat([header, body]);
    const sum = await shasum(main);
    return Buffer2.concat([main, Buffer2.from(sum, "hex")]);
async function updateCachedIndexFile(fs, filepath, cache) {
  const stat = await fs.lstat(filepath);
  const rawIndexFile = await fs.read(filepath);
  const index2 = await GitIndex.from(rawIndexFile);
  cache.map.set(filepath, index2);
  cache.stats.set(filepath, stat);
async function isIndexStale(fs, filepath, cache) {
  const savedStats = cache.stats.get(filepath);
  if (savedStats === void 0)
    return true;
  const currStats = await fs.lstat(filepath);
  if (savedStats === null)
    return false;
  if (currStats === null)
    return false;
  return compareStats(savedStats, currStats);
  static async acquire({ fs, gitdir, cache }, closure) {
    if (!cache[IndexCache])
      cache[IndexCache] = createCache();
    const filepath = `${gitdir}/index`;
    if (lock === null)
      lock = new import_async_lock.default({ maxPending: Infinity });
    let result;
    await lock.acquire(filepath, async () => {
      if (await isIndexStale(fs, filepath, cache[IndexCache])) {
        await updateCachedIndexFile(fs, filepath, cache[IndexCache]);
      }
      const index2 = cache[IndexCache].map.get(filepath);
      result = await closure(index2);
      if (index2._dirty) {
        const buffer2 = await index2.toObject();
        await fs.write(filepath, buffer2);
        cache[IndexCache].stats.set(filepath, await fs.lstat(filepath));
        index2._dirty = false;
      }
    return result;
    this.treePromise = GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      return flatFileListToDirectoryStructure(index2.entries);
      async type() {
        return walker.type(this);
      async mode() {
        return walker.mode(this);
      async stat() {
        return walker.stat(this);
      async content() {
        return walker.content(this);
      async oid() {
        return walker.oid(this);
  async readdir(entry) {
    const filepath = entry._fullpath;
    const tree = await this.treePromise;
    const inode = tree.get(filepath);
    if (!inode)
      return null;
    if (inode.type === "blob")
      return null;
    if (inode.type !== "tree") {
      throw new Error(`ENOTDIR: not a directory, scandir '${filepath}'`);
    }
    const names = inode.children.map((inode2) => inode2.fullpath);
    names.sort(compareStrings);
    return names;
  async type(entry) {
    if (entry._type === false) {
      await entry.stat();
    }
    return entry._type;
  async mode(entry) {
    if (entry._mode === false) {
      await entry.stat();
    }
    return entry._mode;
  async stat(entry) {
    if (entry._stat === false) {
      const tree = await this.treePromise;
      const inode = tree.get(entry._fullpath);
      if (!inode) {
        throw new Error(`ENOENT: no such file or directory, lstat '${entry._fullpath}'`);
      const stats = inode.type === "tree" ? {} : normalizeStats(inode.metadata);
      entry._type = inode.type === "tree" ? "tree" : mode2type(stats.mode);
      entry._mode = stats.mode;
      if (inode.type === "tree") {
        entry._stat = void 0;
      } else {
        entry._stat = stats;
      }
    }
    return entry._stat;
  async content(_entry) {
  async oid(entry) {
    if (entry._oid === false) {
      const tree = await this.treePromise;
      const inode = tree.get(entry._fullpath);
      entry._oid = inode.metadata.oid;
    }
    return entry._oid;
  async get(path2, getall = false) {
    const normalizedPath = normalizePath$1(path2).path;
    const allValues = this.parsedConfig.filter((config) => config.path === normalizedPath).map(({ section, name, value }) => {
      const fn = schema[section] && schema[section][name];
      return fn ? fn(value) : value;
    return getall ? allValues : allValues.pop();
  async getall(path2) {
    return this.get(path2, true);
  async getSubsections(section) {
    return this.parsedConfig.filter((config) => config.section === section && config.isSection).map((config) => config.subsection);
  async deleteSection(section, subsection) {
    this.parsedConfig = this.parsedConfig.filter((config) => !(config.section === section && config.subsection === subsection));
  async append(path2, value) {
    return this.set(path2, value, true);
  async set(path2, value, append3 = false) {
    const {
      section,
      subsection,
      name,
      path: normalizedPath,
      sectionPath
    } = normalizePath$1(path2);
    const configIndex = findLastIndex(this.parsedConfig, (config) => config.path === normalizedPath);
    if (value == null) {
      if (configIndex !== -1) {
        this.parsedConfig.splice(configIndex, 1);
      }
    } else {
      if (configIndex !== -1) {
        const config = this.parsedConfig[configIndex];
        const modifiedConfig = Object.assign({}, config, {
          name,
          value,
          modified: true
        });
        if (append3) {
          this.parsedConfig.splice(configIndex + 1, 0, modifiedConfig);
        } else {
          this.parsedConfig[configIndex] = modifiedConfig;
        }
        const sectionIndex = this.parsedConfig.findIndex((config) => config.path === sectionPath);
        const newConfig = {
          section,
          subsection,
          name,
          value,
          modified: true,
          path: normalizedPath
        };
        if (SECTION_REGEX.test(section) && VARIABLE_NAME_REGEX.test(name)) {
          if (sectionIndex >= 0) {
            this.parsedConfig.splice(sectionIndex + 1, 0, newConfig);
            const newSection = {
              section,
              subsection,
              modified: true,
              path: sectionPath
            };
            this.parsedConfig.push(newSection, newConfig);
    }
  static async get({ fs, gitdir }) {
    const text2 = await fs.read(`${gitdir}/config`, { encoding: "utf8" });
    return GitConfig.from(text2);
  static async save({ fs, gitdir, config }) {
    await fs.write(`${gitdir}/config`, config.toString(), {
      encoding: "utf8"
  static async updateRemoteRefs({
    fs,
    gitdir,
    remote,
    refs,
    symrefs,
    tags,
    refspecs = void 0,
    prune = false,
    pruneTags = false
  }) {
    for (const value of refs.values()) {
      if (!value.match(/[0-9a-f]{40}/)) {
        throw new InvalidOidError(value);
    }
    const config = await GitConfigManager.get({ fs, gitdir });
    if (!refspecs) {
      refspecs = await config.getall(`remote.${remote}.fetch`);
      if (refspecs.length === 0) {
        throw new NoRefspecError(remote);
      }
      refspecs.unshift(`+HEAD:refs/remotes/${remote}/HEAD`);
    }
    const refspec = GitRefSpecSet.from(refspecs);
    const actualRefsToWrite = new Map();
    if (pruneTags) {
      const tags2 = await GitRefManager.listRefs({
        fs,
        gitdir,
        filepath: "refs/tags"
      });
      await GitRefManager.deleteRefs({
        fs,
        gitdir,
        refs: tags2.map((tag2) => `refs/tags/${tag2}`)
      });
    }
    if (tags) {
      for (const serverRef of refs.keys()) {
        if (serverRef.startsWith("refs/tags") && !serverRef.endsWith("^{}")) {
          if (!await GitRefManager.exists({ fs, gitdir, ref: serverRef })) {
            const oid = refs.get(serverRef);
            actualRefsToWrite.set(serverRef, oid);
    }
    const refTranslations = refspec.translate([...refs.keys()]);
    for (const [serverRef, translatedRef] of refTranslations) {
      const value = refs.get(serverRef);
      actualRefsToWrite.set(translatedRef, value);
    }
    const symrefTranslations = refspec.translate([...symrefs.keys()]);
    for (const [serverRef, translatedRef] of symrefTranslations) {
      const value = symrefs.get(serverRef);
      const symtarget = refspec.translateOne(value);
      if (symtarget) {
        actualRefsToWrite.set(translatedRef, `ref: ${symtarget}`);
    }
    const pruned = [];
    if (prune) {
      for (const filepath of refspec.localNamespaces()) {
        const refs2 = (await GitRefManager.listRefs({
          fs,
          gitdir,
          filepath
        })).map((file) => `${filepath}/${file}`);
        for (const ref of refs2) {
          if (!actualRefsToWrite.has(ref)) {
            pruned.push(ref);
      if (pruned.length > 0) {
        await GitRefManager.deleteRefs({ fs, gitdir, refs: pruned });
    }
    for (const [key2, value] of actualRefsToWrite) {
      await fs.write(join(gitdir, key2), `${value.trim()}
`, "utf8");
    }
    return { pruned };
  static async writeRef({ fs, gitdir, ref, value }) {
    if (!value.match(/[0-9a-f]{40}/)) {
      throw new InvalidOidError(value);
    }
    await fs.write(join(gitdir, ref), `${value.trim()}
  static async writeSymbolicRef({ fs, gitdir, ref, value }) {
    await fs.write(join(gitdir, ref), `ref: ${value.trim()}
  static async deleteRef({ fs, gitdir, ref }) {
    return GitRefManager.deleteRefs({ fs, gitdir, refs: [ref] });
  static async deleteRefs({ fs, gitdir, refs }) {
    await Promise.all(refs.map((ref) => fs.rm(join(gitdir, ref))));
    let text2 = await fs.read(`${gitdir}/packed-refs`, { encoding: "utf8" });
    const packed = GitPackedRefs.from(text2);
    const beforeSize = packed.refs.size;
    for (const ref of refs) {
      if (packed.refs.has(ref)) {
        packed.delete(ref);
    }
    if (packed.refs.size < beforeSize) {
      text2 = packed.toString();
      await fs.write(`${gitdir}/packed-refs`, text2, { encoding: "utf8" });
    }
  static async resolve({ fs, gitdir, ref, depth = void 0 }) {
    if (depth !== void 0) {
      depth--;
      if (depth === -1) {
    }
    let sha;
    if (ref.startsWith("ref: ")) {
      ref = ref.slice("ref: ".length);
      return GitRefManager.resolve({ fs, gitdir, ref, depth });
    }
    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
      return ref;
    }
    const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
    const allpaths = refpaths(ref).filter((p) => !GIT_FILES.includes(p));
    for (const ref2 of allpaths) {
      sha = await fs.read(`${gitdir}/${ref2}`, { encoding: "utf8" }) || packedMap.get(ref2);
      if (sha) {
        return GitRefManager.resolve({ fs, gitdir, ref: sha.trim(), depth });
    }
    throw new NotFoundError(ref);
  static async exists({ fs, gitdir, ref }) {
    try {
      await GitRefManager.expand({ fs, gitdir, ref });
      return true;
    } catch (err) {
      return false;
    }
  static async expand({ fs, gitdir, ref }) {
    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
      return ref;
    }
    const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
    const allpaths = refpaths(ref);
    for (const ref2 of allpaths) {
      if (await fs.exists(`${gitdir}/${ref2}`))
        return ref2;
      if (packedMap.has(ref2))
        return ref2;
    }
    throw new NotFoundError(ref);
  static async expandAgainstMap({ ref, map }) {
    const allpaths = refpaths(ref);
    for (const ref2 of allpaths) {
      if (await map.has(ref2))
        return ref2;
    }
    throw new NotFoundError(ref);
  static async packedRefs({ fs, gitdir }) {
    const text2 = await fs.read(`${gitdir}/packed-refs`, { encoding: "utf8" });
    const packed = GitPackedRefs.from(text2);
    return packed.refs;
  static async listRefs({ fs, gitdir, filepath }) {
    const packedMap = GitRefManager.packedRefs({ fs, gitdir });
    let files = null;
    try {
      files = await fs.readdirDeep(`${gitdir}/${filepath}`);
      files = files.map((x) => x.replace(`${gitdir}/${filepath}/`, ""));
    } catch (err) {
      files = [];
    }
    for (let key2 of (await packedMap).keys()) {
      if (key2.startsWith(filepath)) {
        key2 = key2.replace(filepath + "/", "");
        if (!files.includes(key2)) {
          files.push(key2);
    }
    files.sort(compareRefNames);
    return files;
  static async listBranches({ fs, gitdir, remote }) {
    if (remote) {
      return GitRefManager.listRefs({
        filepath: `refs/remotes/${remote}`
    } else {
      return GitRefManager.listRefs({ fs, gitdir, filepath: `refs/heads` });
    }
  }
  static async listTags({ fs, gitdir }) {
    const tags = await GitRefManager.listRefs({
      fs,
      gitdir,
      filepath: `refs/tags`
    return tags.filter((x) => !x.endsWith("^{}"));
async function readObjectLoose({ fs, gitdir, oid }) {
  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
  const file = await fs.read(`${gitdir}/${source}`);
  if (!file) {
    return null;
  }
  return { object: file, format: "deflated", source };
  async byte() {
    if (this.eof())
      return;
    if (!this.started)
      await this._init();
    if (this.cursor === this.buffer.length) {
      await this._loadnext();
      if (this._ended)
    }
    this._moveCursor(1);
    return this.buffer[this.undoCursor];
  async chunk() {
    if (this.eof())
      return;
    if (!this.started)
      await this._init();
    if (this.cursor === this.buffer.length) {
      await this._loadnext();
      if (this._ended)
    }
    this._moveCursor(this.buffer.length);
    return this.buffer.slice(this.undoCursor, this.cursor);
  async read(n) {
    if (this.eof())
      return;
    if (!this.started)
      await this._init();
    if (this.cursor + n > this.buffer.length) {
      this._trim();
      await this._accumulate(n);
    }
    this._moveCursor(n);
    return this.buffer.slice(this.undoCursor, this.cursor);
  async skip(n) {
    if (this.eof())
      return;
    if (!this.started)
      await this._init();
    if (this.cursor + n > this.buffer.length) {
      this._trim();
      await this._accumulate(n);
    }
    this._moveCursor(n);
  async undo() {
    this.cursor = this.undoCursor;
  async _next() {
    this.started = true;
    let { done, value } = await this.stream.next();
    if (done) {
      this._ended = true;
    }
    if (value) {
      value = Buffer2.from(value);
    }
    return value;
  async _accumulate(n) {
    if (this._ended)
      return;
    const buffers = [this.buffer];
    while (this.cursor + n > lengthBuffers(buffers)) {
      const nextbuffer = await this._next();
        break;
      buffers.push(nextbuffer);
    }
    this.buffer = Buffer2.concat(buffers);
  async _loadnext() {
    this._discardedBytes += this.buffer.length;
    this.undoCursor = 0;
    this.cursor = 0;
    this.buffer = await this._next();
  async _init() {
    this.buffer = await this._next();
async function listpack(stream, onData) {
  const reader = new StreamReader(stream);
  let PACK = await reader.read(4);
  PACK = PACK.toString("utf8");
  if (PACK !== "PACK") {
    throw new InternalError(`Invalid PACK header '${PACK}'`);
  }
  let version2 = await reader.read(4);
  version2 = version2.readUInt32BE(0);
  if (version2 !== 2) {
    throw new InternalError(`Invalid packfile version: ${version2}`);
  }
  let numObjects = await reader.read(4);
  numObjects = numObjects.readUInt32BE(0);
  if (numObjects < 1)
    return;
  while (!reader.eof() && numObjects--) {
    const offset = reader.tell();
    const { type, length, ofs, reference } = await parseHeader(reader);
    const inflator = new import_pako.default.Inflate();
    while (!inflator.result) {
      const chunk = await reader.chunk();
      if (!chunk)
        break;
      inflator.push(chunk, false);
      if (inflator.err) {
        throw new InternalError(`Pako error: ${inflator.msg}`);
      }
      if (inflator.result) {
        if (inflator.result.length !== length) {
          throw new InternalError(`Inflated object size is different from that stated in packfile.`);
        }
        await reader.undo();
        await reader.read(chunk.length - inflator.strm.avail_in);
        const end = reader.tell();
        await onData({
          data: inflator.result,
          type,
          num: numObjects,
          offset,
          end,
          reference,
          ofs
        });
  }
async function parseHeader(reader) {
  let byte = await reader.byte();
  const type = byte >> 4 & 7;
  let length = byte & 15;
  if (byte & 128) {
    let shift = 4;
    do {
      byte = await reader.byte();
      length |= (byte & 127) << shift;
      shift += 7;
    } while (byte & 128);
  }
  let ofs;
  let reference;
  if (type === 6) {
    let shift = 0;
    ofs = 0;
    const bytes = [];
    do {
      byte = await reader.byte();
      ofs |= (byte & 127) << shift;
      shift += 7;
      bytes.push(byte);
    } while (byte & 128);
    reference = Buffer2.from(bytes);
  }
  if (type === 7) {
    const buf = await reader.read(20);
    reference = buf;
  }
  return { type, length, ofs, reference };
async function inflate(buffer2) {
  if (supportsDecompressionStream === null) {
    supportsDecompressionStream = testDecompressionStream();
  }
  return supportsDecompressionStream ? browserInflate(buffer2) : import_pako.default.inflate(buffer2);
async function browserInflate(buffer2) {
  const ds = new DecompressionStream("deflate");
  const d = new Blob([buffer2]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(d).arrayBuffer());
  static async fromIdx({ idx, getExternalRefDelta }) {
    const reader = new BufferCursor(idx);
    const magic = reader.slice(4).toString("hex");
    if (magic !== "ff744f63") {
      return;
    }
    const version2 = reader.readUInt32BE();
    if (version2 !== 2) {
      throw new InternalError(`Unable to read version ${version2} packfile IDX. (Only version 2 supported)`);
    }
    if (idx.byteLength > 2048 * 1024 * 1024) {
      throw new InternalError(`To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size.`);
    }
    reader.seek(reader.tell() + 4 * 255);
    const size = reader.readUInt32BE();
    const hashes = [];
    for (let i = 0; i < size; i++) {
      const hash2 = reader.slice(20).toString("hex");
      hashes[i] = hash2;
    }
    reader.seek(reader.tell() + 4 * size);
    const offsets = new Map();
    for (let i = 0; i < size; i++) {
      offsets.set(hashes[i], reader.readUInt32BE());
    }
    const packfileSha = reader.slice(20).toString("hex");
    return new GitPackIndex({
      hashes,
      crcs: {},
      offsets,
      packfileSha,
      getExternalRefDelta
  static async fromPack({ pack, getExternalRefDelta, onProgress }) {
    const listpackTypes = {
      1: "commit",
      2: "tree",
      3: "blob",
      4: "tag",
      6: "ofs-delta",
      7: "ref-delta"
    };
    const offsetToObject = {};
    const packfileSha = pack.slice(-20).toString("hex");
    const hashes = [];
    const crcs = {};
    const offsets = new Map();
    let totalObjectCount = null;
    let lastPercent = null;
    await listpack([pack], async ({ data, type, reference, offset, num: num2 }) => {
      if (totalObjectCount === null)
        totalObjectCount = num2;
      const percent = Math.floor((totalObjectCount - num2) * 100 / totalObjectCount);
      if (percent !== lastPercent) {
        if (onProgress) {
          await onProgress({
            phase: "Receiving objects",
            loaded: totalObjectCount - num2,
            total: totalObjectCount
          });
      lastPercent = percent;
      type = listpackTypes[type];
      if (["commit", "tree", "blob", "tag"].includes(type)) {
        offsetToObject[offset] = {
          type,
          offset
        };
      } else if (type === "ofs-delta") {
        offsetToObject[offset] = {
          type,
          offset
        };
      } else if (type === "ref-delta") {
        offsetToObject[offset] = {
          type,
          offset
        };
    const offsetArray = Object.keys(offsetToObject).map(Number);
    for (const [i, start] of offsetArray.entries()) {
      const end = i + 1 === offsetArray.length ? pack.byteLength - 20 : offsetArray[i + 1];
      const o = offsetToObject[start];
      const crc = import_crc_32.default.buf(pack.slice(start, end)) >>> 0;
      o.end = end;
      o.crc = crc;
    }
    const p = new GitPackIndex({
      pack: Promise.resolve(pack),
      packfileSha,
      crcs,
      hashes,
      offsets,
      getExternalRefDelta
    lastPercent = null;
    let count = 0;
    const objectsByDepth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let offset in offsetToObject) {
      offset = Number(offset);
      const percent = Math.floor(count * 100 / totalObjectCount);
      if (percent !== lastPercent) {
        if (onProgress) {
          await onProgress({
            phase: "Resolving deltas",
            loaded: count,
            total: totalObjectCount
          });
      count++;
      lastPercent = percent;
      const o = offsetToObject[offset];
      if (o.oid)
        continue;
      try {
        p.readDepth = 0;
        p.externalReadDepth = 0;
        const { type, object } = await p.readSlice({ start: offset });
        objectsByDepth[p.readDepth] += 1;
        const oid = await shasum(GitObject.wrap({ type, object }));
        o.oid = oid;
        hashes.push(oid);
        offsets.set(oid, offset);
        crcs[oid] = o.crc;
      } catch (err) {
        continue;
      }
    }
    hashes.sort();
    return p;
  async toBuffer() {
    const buffers = [];
    const write = (str, encoding) => {
      buffers.push(Buffer2.from(str, encoding));
    };
    write("ff744f63", "hex");
    write("00000002", "hex");
    const fanoutBuffer = new BufferCursor(Buffer2.alloc(256 * 4));
    for (let i = 0; i < 256; i++) {
      let count = 0;
      for (const hash2 of this.hashes) {
        if (parseInt(hash2.slice(0, 2), 16) <= i)
          count++;
      }
      fanoutBuffer.writeUInt32BE(count);
    }
    buffers.push(fanoutBuffer.buffer);
    for (const hash2 of this.hashes) {
      write(hash2, "hex");
    }
    const crcsBuffer = new BufferCursor(Buffer2.alloc(this.hashes.length * 4));
    for (const hash2 of this.hashes) {
      crcsBuffer.writeUInt32BE(this.crcs[hash2]);
    }
    buffers.push(crcsBuffer.buffer);
    const offsetsBuffer = new BufferCursor(Buffer2.alloc(this.hashes.length * 4));
    for (const hash2 of this.hashes) {
      offsetsBuffer.writeUInt32BE(this.offsets.get(hash2));
    }
    buffers.push(offsetsBuffer.buffer);
    write(this.packfileSha, "hex");
    const totalBuffer = Buffer2.concat(buffers);
    const sha = await shasum(totalBuffer);
    const shaBuffer = Buffer2.alloc(20);
    shaBuffer.write(sha, "hex");
    return Buffer2.concat([totalBuffer, shaBuffer]);
  }
  async load({ pack }) {
    this.pack = pack;
  }
  async unload() {
    this.pack = null;
  }
  async read({ oid }) {
    if (!this.offsets.get(oid)) {
      if (this.getExternalRefDelta) {
        this.externalReadDepth++;
        return this.getExternalRefDelta(oid);
      } else {
        throw new InternalError(`Could not read object ${oid} from packfile`);
      }
    }
    const start = this.offsets.get(oid);
    return this.readSlice({ start });
  }
  async readSlice({ start }) {
    if (this.offsetCache[start]) {
      return Object.assign({}, this.offsetCache[start]);
    }
    this.readDepth++;
    const types2 = {
      16: "commit",
      32: "tree",
      48: "blob",
      64: "tag",
      96: "ofs_delta",
      112: "ref_delta"
    };
    if (!this.pack) {
      throw new InternalError("Tried to read from a GitPackIndex with no packfile loaded into memory");
    }
    const raw = (await this.pack).slice(start);
    const reader = new BufferCursor(raw);
    const byte = reader.readUInt8();
    const btype = byte & 112;
    let type = types2[btype];
    if (type === void 0) {
      throw new InternalError("Unrecognized type: 0b" + btype.toString(2));
    }
    const lastFour = byte & 15;
    let length = lastFour;
    const multibyte = byte & 128;
    if (multibyte) {
      length = otherVarIntDecode(reader, lastFour);
    }
    let base = null;
    let object = null;
    if (type === "ofs_delta") {
      const offset = decodeVarInt(reader);
      const baseOffset = start - offset;
      ({ object: base, type } = await this.readSlice({ start: baseOffset }));
    }
    if (type === "ref_delta") {
      const oid = reader.slice(20).toString("hex");
      ({ object: base, type } = await this.read({ oid }));
    }
    const buffer2 = raw.slice(reader.tell());
    object = Buffer2.from(await inflate(buffer2));
    if (object.byteLength !== length) {
      throw new InternalError(`Packfile told us object would have length ${length} but it had length ${object.byteLength}`);
    }
    if (base) {
      object = Buffer2.from(applyDelta(object, base));
    }
    if (this.readDepth > 3) {
      this.offsetCache[start] = { type, object };
    }
    return { type, format: "content", object };
async function loadPackIndex({
  fs,
  filename,
  getExternalRefDelta,
  emitter,
  emitterPrefix
}) {
  const idx = await fs.read(filename);
  return GitPackIndex.fromIdx({ idx, getExternalRefDelta });
async function readObjectPacked({
  fs,
  cache,
  gitdir,
  oid,
  format = "content",
  getExternalRefDelta
}) {
  let list = await fs.readdir(join(gitdir, "objects/pack"));
  list = list.filter((x) => x.endsWith(".idx"));
  for (const filename of list) {
    const indexFile = `${gitdir}/objects/pack/${filename}`;
    const p = await readPackIndex({
      fs,
      cache,
      filename: indexFile,
      getExternalRefDelta
    });
    if (p.error)
      throw new InternalError(p.error);
    if (p.offsets.has(oid)) {
      if (!p.pack) {
        const packFile = indexFile.replace(/idx$/, "pack");
        p.pack = fs.read(packFile);
      const result = await p.read({ oid, getExternalRefDelta });
      result.format = "content";
      result.source = `objects/pack/${filename.replace(/idx$/, "pack")}`;
      return result;
  }
  return null;
async function _readObject({
  fs,
  cache,
  gitdir,
  oid,
  format = "content"
}) {
  const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
  let result;
  if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
    result = { format: "wrapped", object: Buffer2.from(`tree 0\0`) };
  }
  if (!result) {
    result = await readObjectLoose({ fs, gitdir, oid });
  }
  if (!result) {
    result = await readObjectPacked({
      fs,
      cache,
      gitdir,
      oid,
      getExternalRefDelta
    });
  }
  if (!result) {
    throw new NotFoundError(oid);
  }
  if (format === "deflated") {
    return result;
  }
  if (result.format === "deflated") {
    result.object = Buffer2.from(await inflate(result.object));
    result.format = "wrapped";
  }
  if (result.format === "wrapped") {
    if (format === "wrapped" && result.format === "wrapped") {
    const sha = await shasum(result.object);
    if (sha !== oid) {
      throw new InternalError(`SHA check failed! Expected ${oid}, computed ${sha}`);
    const { object, type } = GitObject.unwrap(result.object);
    result.type = type;
    result.object = object;
    result.format = "content";
  }
  if (result.format === "content") {
    if (format === "content")
      return result;
    return;
  }
  throw new InternalError(`invalid format "${result.format}"`);
  static async sign(tag2, sign, secretKey) {
    const payload = tag2.payload();
    let { signature } = await sign({ payload, secretKey });
    signature = normalizeNewlines(signature);
    const signedTag = payload + signature;
    return GitAnnotatedTag.from(signedTag);
  static async sign(commit2, sign, secretKey) {
    const payload = commit2.withoutSignature();
    const message = GitCommit.justMessage(commit2._commit);
    let { signature } = await sign({ payload, secretKey });
    signature = normalizeNewlines(signature);
    const headers = GitCommit.justHeaders(commit2._commit);
    const signedCommit = headers + "\ngpgsig" + indent(signature) + "\n" + message;
    return GitCommit.from(signedCommit);
async function resolveTree({ fs, cache, gitdir, oid }) {
  if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
    return { tree: GitTree.from([]), oid };
  }
  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
  if (type === "tag") {
    oid = GitAnnotatedTag.from(object).parse().object;
    return resolveTree({ fs, cache, gitdir, oid });
  }
  if (type === "commit") {
    oid = GitCommit.from(object).parse().tree;
    return resolveTree({ fs, cache, gitdir, oid });
  }
  if (type !== "tree") {
    throw new ObjectTypeError(oid, type, "tree");
  }
  return { tree: GitTree.from(object), oid };
    this.mapPromise = (async () => {
        oid = await GitRefManager.resolve({ fs, gitdir, ref });
      const tree = await resolveTree({ fs, cache: this.cache, gitdir, oid });
    })();
      async type() {
        return walker.type(this);
      async mode() {
        return walker.mode(this);
      async stat() {
        return walker.stat(this);
      async content() {
        return walker.content(this);
      async oid() {
        return walker.oid(this);
  async readdir(entry) {
    const filepath = entry._fullpath;
    const { fs, cache, gitdir } = this;
    const map = await this.mapPromise;
    const obj = map.get(filepath);
    if (!obj)
      throw new Error(`No obj for ${filepath}`);
    const oid = obj.oid;
    if (!oid)
      throw new Error(`No oid for obj ${JSON.stringify(obj)}`);
    if (obj.type !== "tree") {
      return null;
    }
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type !== obj.type) {
      throw new ObjectTypeError(oid, type, obj.type);
    }
    const tree = GitTree.from(object);
    for (const entry2 of tree) {
      map.set(join(filepath, entry2.path), entry2);
    }
    return tree.entries().map((entry2) => join(filepath, entry2.path));
  async type(entry) {
    if (entry._type === false) {
      const map = await this.mapPromise;
      const { type } = map.get(entry._fullpath);
      entry._type = type;
    }
    return entry._type;
  async mode(entry) {
    if (entry._mode === false) {
      const map = await this.mapPromise;
      const { mode } = map.get(entry._fullpath);
      entry._mode = normalizeMode(parseInt(mode, 8));
    }
    return entry._mode;
  async stat(_entry) {
  async content(entry) {
    if (entry._content === false) {
      const map = await this.mapPromise;
      const { fs, cache, gitdir } = this;
      const obj = map.get(entry._fullpath);
      const oid = obj.oid;
      const { type, object } = await _readObject({ fs, cache, gitdir, oid });
      if (type !== "blob") {
        entry._content = void 0;
      } else {
        entry._content = new Uint8Array(object);
    }
    return entry._content;
  async oid(entry) {
    if (entry._oid === false) {
      const map = await this.mapPromise;
      const obj = map.get(entry._fullpath);
      entry._oid = obj.oid;
    }
    return entry._oid;
      async type() {
        return walker.type(this);
      async mode() {
        return walker.mode(this);
      async stat() {
        return walker.stat(this);
      async content() {
        return walker.content(this);
      async oid() {
        return walker.oid(this);
  async readdir(entry) {
    const filepath = entry._fullpath;
    const { fs, dir } = this;
    const names = await fs.readdir(join(dir, filepath));
    if (names === null)
      return null;
    return names.map((name) => join(filepath, name));
  async type(entry) {
    if (entry._type === false) {
      await entry.stat();
    }
    return entry._type;
  async mode(entry) {
    if (entry._mode === false) {
      await entry.stat();
    }
    return entry._mode;
  async stat(entry) {
    if (entry._stat === false) {
      const { fs, dir } = this;
      let stat = await fs.lstat(`${dir}/${entry._fullpath}`);
      if (!stat) {
        throw new Error(`ENOENT: no such file or directory, lstat '${entry._fullpath}'`);
      let type = stat.isDirectory() ? "tree" : "blob";
      if (type === "blob" && !stat.isFile() && !stat.isSymbolicLink()) {
        type = "special";
      }
      entry._type = type;
      stat = normalizeStats(stat);
      entry._mode = stat.mode;
      if (stat.size === -1 && entry._actualSize) {
        stat.size = entry._actualSize;
      }
      entry._stat = stat;
    }
    return entry._stat;
  async content(entry) {
    if (entry._content === false) {
      const { fs, dir } = this;
      if (await entry.type() === "tree") {
        entry._content = void 0;
      } else {
        const content = await fs.read(`${dir}/${entry._fullpath}`);
        entry._actualSize = content.length;
        if (entry._stat && entry._stat.size === -1) {
          entry._stat.size = entry._actualSize;
        entry._content = new Uint8Array(content);
    }
    return entry._content;
  async oid(entry) {
    if (entry._oid === false) {
      const { fs, gitdir, cache } = this;
      let oid;
      await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
        const stage = index2.entriesMap.get(entry._fullpath);
        const stats = await entry.stat();
        if (!stage || compareStats(stats, stage)) {
          const content = await entry.content();
          if (content === void 0) {
            oid = void 0;
          } else {
            oid = await shasum(GitObject.wrap({ type: "blob", object: await entry.content() }));
            if (stage && oid === stage.oid && stats.mode === stage.mode && compareStats(stats, stage)) {
              index2.insert({
                filepath: entry._fullpath,
                stats,
                oid
              });
          }
        } else {
          oid = stage.oid;
        }
      });
      entry._oid = oid;
    }
    return entry._oid;
  static async isIgnored({ fs, dir, gitdir = join(dir, ".git"), filepath }) {
    if (basename(filepath) === ".git")
      return true;
    if (filepath === ".")
      return false;
    let excludes = "";
    const excludesFile = join(gitdir, "info", "exclude");
    if (await fs.exists(excludesFile)) {
      excludes = await fs.read(excludesFile, "utf8");
    }
    const pairs = [
      {
        gitignore: join(dir, ".gitignore"),
        filepath
    ];
    const pieces = filepath.split("/").filter(Boolean);
    for (let i = 1; i < pieces.length; i++) {
      const folder = pieces.slice(0, i).join("/");
      const file = pieces.slice(i).join("/");
      pairs.push({
        gitignore: join(dir, folder, ".gitignore"),
        filepath: file
      });
    }
    let ignoredStatus = false;
    for (const p of pairs) {
      let file;
      try {
        file = await fs.read(p.gitignore, "utf8");
      } catch (err) {
        if (err.code === "NOENT")
          continue;
      const ign = (0, import_ignore.default)().add(excludes);
      ign.add(file);
      const parentdir = dirname(p.filepath);
      if (parentdir !== "." && ign.ignores(parentdir))
        return true;
      if (ignoredStatus) {
        ignoredStatus = !ign.test(p.filepath).unignored;
      } else {
        ignoredStatus = ign.test(p.filepath).ignored;
      }
    }
    return ignoredStatus;
async function rmRecursive(fs, filepath) {
  const entries = await fs.readdir(filepath);
  if (entries == null) {
    await fs.rm(filepath);
  } else if (entries.length) {
    await Promise.all(entries.map((entry) => {
      const subpath = join(filepath, entry);
      return fs.lstat(subpath).then((stat) => {
        if (!stat)
          return;
        return stat.isDirectory() ? rmRecursive(fs, subpath) : fs.rm(subpath);
      });
    })).then(() => fs.rmdir(filepath));
  } else {
    await fs.rmdir(filepath);
  }
  async exists(filepath, options = {}) {
    try {
      await this._stat(filepath);
      return true;
    } catch (err) {
      if (err.code === "ENOENT" || err.code === "ENOTDIR") {
        return false;
      } else {
        console.log('Unhandled error in "FileSystem.exists()" function', err);
        throw err;
    }
  async read(filepath, options = {}) {
    try {
      let buffer2 = await this._readFile(filepath, options);
      if (typeof buffer2 !== "string") {
        buffer2 = Buffer2.from(buffer2);
      return buffer2;
    } catch (err) {
      return null;
    }
  async write(filepath, contents, options = {}) {
    try {
      await this._writeFile(filepath, contents, options);
      return;
    } catch (err) {
      await this.mkdir(dirname(filepath));
      await this._writeFile(filepath, contents, options);
    }
  async mkdir(filepath, _selfCall = false) {
    try {
      await this._mkdir(filepath);
      return;
    } catch (err) {
      if (err === null)
      if (err.code === "EEXIST")
        return;
      if (_selfCall)
        throw err;
      if (err.code === "ENOENT") {
        const parent = dirname(filepath);
        if (parent === "." || parent === "/" || parent === filepath)
        await this.mkdir(parent);
        await this.mkdir(filepath, true);
    }
  async rm(filepath) {
    try {
      await this._unlink(filepath);
    } catch (err) {
      if (err.code !== "ENOENT")
        throw err;
    }
  async rmdir(filepath, opts) {
    try {
      if (opts && opts.recursive) {
        await this._rm(filepath, opts);
      } else {
        await this._rmdir(filepath);
    } catch (err) {
      if (err.code !== "ENOENT")
        throw err;
    }
  async readdir(filepath) {
    try {
      const names = await this._readdir(filepath);
      names.sort(compareStrings);
      return names;
    } catch (err) {
      if (err.code === "ENOTDIR")
        return null;
      return [];
    }
  async readdirDeep(dir) {
    const subdirs = await this._readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
      const res = dir + "/" + subdir;
      return (await this._stat(res)).isDirectory() ? this.readdirDeep(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
  async lstat(filename) {
    try {
      const stats = await this._lstat(filename);
      return stats;
    } catch (err) {
      if (err.code === "ENOENT") {
        return null;
      throw err;
    }
  async readlink(filename, opts = { encoding: "buffer" }) {
    try {
      const link = await this._readlink(filename, opts);
      return Buffer2.isBuffer(link) ? link : Buffer2.from(link);
    } catch (err) {
      if (err.code === "ENOENT") {
        return null;
      throw err;
    }
  async writelink(filename, buffer2) {
    return this._symlink(buffer2.toString("utf8"), filename);
async function writeObjectLoose({ fs, gitdir, object, format, oid }) {
  if (format !== "deflated") {
    throw new InternalError("GitObjectStoreLoose expects objects to write to be in deflated format");
  }
  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
  const filepath = `${gitdir}/${source}`;
  if (!await fs.exists(filepath))
    await fs.write(filepath, object);
async function deflate(buffer2) {
  if (supportsCompressionStream === null) {
    supportsCompressionStream = testCompressionStream();
  }
  return supportsCompressionStream ? browserDeflate(buffer2) : import_pako.default.deflate(buffer2);
async function browserDeflate(buffer2) {
  const cs = new CompressionStream("deflate");
  const c = new Blob([buffer2]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(c).arrayBuffer());
async function _writeObject({
  fs,
  gitdir,
  type,
  object,
  format = "content",
  oid = void 0,
  dryRun = false
}) {
  if (format !== "deflated") {
    if (format !== "wrapped") {
      object = GitObject.wrap({ type, object });
    oid = await shasum(object);
    object = Buffer2.from(await deflate(object));
  }
  if (!dryRun) {
    await writeObjectLoose({ fs, gitdir, object, format: "deflated", oid });
  }
  return oid;
async function add({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  filepath,
  cache = {},
  force = false
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("dir", dir);
    assertParameter("gitdir", gitdir);
    assertParameter("filepath", filepath);
    const fs = new FileSystem(_fs);
    await GitIndexManager.acquire({ fs, gitdir, cache }, async (index2) => {
      return addToIndex({ dir, gitdir, fs, filepath, index: index2, force });
    });
  } catch (err) {
    err.caller = "git.add";
    throw err;
  }
async function addToIndex({ dir, gitdir, fs, filepath, index: index2, force }) {
  filepath = Array.isArray(filepath) ? filepath : [filepath];
  const promises = filepath.map(async (currentFilepath) => {
    if (!force) {
      const ignored = await GitIgnoreManager.isIgnored({
        fs,
        dir,
        gitdir,
        filepath: currentFilepath
      });
      if (ignored)
        return;
    const stats = await fs.lstat(join(dir, currentFilepath));
    if (!stats)
      throw new NotFoundError(currentFilepath);
    if (stats.isDirectory()) {
      const children2 = await fs.readdir(join(dir, currentFilepath));
      const promises2 = children2.map((child) => addToIndex({
        dir,
        gitdir,
        fs,
        filepath: [join(currentFilepath, child)],
        index: index2,
        force
      }));
      await Promise.all(promises2);
    } else {
      const object = stats.isSymbolicLink() ? await fs.readlink(join(dir, currentFilepath)).then(posixifyPathBuffer) : await fs.read(join(dir, currentFilepath));
      if (object === null)
        throw new NotFoundError(currentFilepath);
      const oid = await _writeObject({ fs, gitdir, type: "blob", object });
      index2.insert({ filepath: currentFilepath, stats, oid });
  const settledPromises = await Promise.allSettled(promises);
  const rejectedPromises = settledPromises.filter((settle) => settle.status === "rejected").map((settle) => settle.reason);
  if (rejectedPromises.length > 1) {
    throw new MultipleGitError(rejectedPromises);
  }
  if (rejectedPromises.length === 1) {
    throw rejectedPromises[0];
  }
  const fulfilledPromises = settledPromises.filter((settle) => settle.status === "fulfilled" && settle.value).map((settle) => settle.value);
  return fulfilledPromises;
async function _commit({
  fs,
  cache,
  onSign,
  gitdir,
  message,
  author,
  committer,
  signingKey,
  dryRun = false,
  noUpdateBranch = false,
  ref,
  parent,
  tree
}) {
  if (!ref) {
    ref = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: "HEAD",
      depth: 2
    });
  }
  return GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
    const inodes = flatFileListToDirectoryStructure(index2.entries);
    const inode = inodes.get(".");
    if (!tree) {
      tree = await constructTree({ fs, gitdir, inode, dryRun });
    if (!parent) {
      try {
        parent = [
          await GitRefManager.resolve({
            ref
          })
        ];
      } catch (err) {
        parent = [];
    } else {
      parent = await Promise.all(parent.map((p) => {
        return GitRefManager.resolve({ fs, gitdir, ref: p });
      }));
    let comm = GitCommit.from({
      tree,
      parent,
      author,
      committer,
      message
    });
    if (signingKey) {
      comm = await GitCommit.sign(comm, onSign, signingKey);
    }
    const oid = await _writeObject({
      type: "commit",
      object: comm.toObject(),
    if (!noUpdateBranch && !dryRun) {
      await GitRefManager.writeRef({
        ref,
        value: oid
async function constructTree({ fs, gitdir, inode, dryRun }) {
  const children2 = inode.children;
  for (const inode2 of children2) {
    if (inode2.type === "tree") {
      inode2.metadata.mode = "040000";
      inode2.metadata.oid = await constructTree({ fs, gitdir, inode: inode2, dryRun });
    }
  }
  const entries = children2.map((inode2) => ({
    mode: inode2.metadata.mode,
    path: inode2.basename,
    oid: inode2.metadata.oid,
    type: inode2.type
  }));
  const tree = GitTree.from(entries);
  const oid = await _writeObject({
    type: "tree",
    object: tree.toObject(),
    dryRun
  return oid;
}
async function resolveFilepath({ fs, cache, gitdir, oid, filepath }) {
  if (filepath.startsWith("/")) {
    throw new InvalidFilepathError("leading-slash");
  } else if (filepath.endsWith("/")) {
    throw new InvalidFilepathError("trailing-slash");
  }
  const _oid = oid;
  const result = await resolveTree({ fs, cache, gitdir, oid });
  const tree = result.tree;
  if (filepath === "") {
    oid = result.oid;
  } else {
    const pathArray = filepath.split("/");
    oid = await _resolveFilepath({
      cache,
      tree,
      pathArray,
      oid: _oid,
      filepath
  }
  return oid;
}
async function _resolveFilepath({
  fs,
  cache,
  gitdir,
  tree,
  pathArray,
  oid,
  filepath
}) {
  const name = pathArray.shift();
  for (const entry of tree) {
    if (entry.path === name) {
      if (pathArray.length === 0) {
        return entry.oid;
      } else {
        const { type, object } = await _readObject({
          fs,
          cache,
          gitdir,
          oid: entry.oid
        });
        if (type !== "tree") {
          throw new ObjectTypeError(oid, type, "blob", filepath);
        }
        tree = GitTree.from(object);
        return _resolveFilepath({
          fs,
          cache,
          gitdir,
          tree,
          pathArray,
          oid,
          filepath
        });
      }
    }
  }
  throw new NotFoundError(`file or directory found at "${oid}:${filepath}"`);
}
async function _readTree({
  fs,
  cache,
  gitdir,
  oid,
  filepath = void 0
}) {
  if (filepath !== void 0) {
    oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
  }
  const { tree, oid: treeOid } = await resolveTree({ fs, cache, gitdir, oid });
  const result = {
    oid: treeOid,
    tree: tree.entries()
  };
  return result;
}
async function _writeTree({ fs, gitdir, tree }) {
  const object = GitTree.from(tree).toObject();
  const oid = await _writeObject({
    fs,
    gitdir,
    type: "tree",
    object,
    format: "content"
  return oid;
async function _addNote({
  fs,
  cache,
  onSign,
  gitdir,
  ref,
  oid,
  note,
  force,
  author,
  committer,
  signingKey
}) {
  let parent;
  try {
    parent = await GitRefManager.resolve({ gitdir, fs, ref });
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err;
    }
  }
  const result = await _readTree({
    fs,
    cache,
    gitdir,
    oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
  });
  let tree = result.tree;
  if (force) {
    tree = tree.filter((entry) => entry.path !== oid);
  } else {
    for (const entry of tree) {
      if (entry.path === oid) {
        throw new AlreadyExistsError("note", oid);
      }
    }
  }
  if (typeof note === "string") {
    note = Buffer2.from(note, "utf8");
  }
  const noteOid = await _writeObject({
    fs,
    gitdir,
    type: "blob",
    object: note,
    format: "content"
  });
  tree.push({ mode: "100644", path: oid, oid: noteOid, type: "blob" });
  const treeOid = await _writeTree({
    fs,
    gitdir,
    tree
  });
  const commitOid = await _commit({
    tree: treeOid,
    parent: parent && [parent],
    message: `Note added by 'isomorphic-git addNote'
`,
  });
  return commitOid;
}
async function _getConfig({ fs, gitdir, path: path2 }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  return config.get(path2);
}
async function normalizeAuthorObject({ fs, gitdir, author = {} }) {
  let { name, email, timestamp, timezoneOffset } = author;
  name = name || await _getConfig({ fs, gitdir, path: "user.name" });
  email = email || await _getConfig({ fs, gitdir, path: "user.email" }) || "";
  if (name === void 0) {
    return void 0;
  }
  timestamp = timestamp != null ? timestamp : Math.floor(Date.now() / 1e3);
  timezoneOffset = timezoneOffset != null ? timezoneOffset : new Date(timestamp * 1e3).getTimezoneOffset();
  return { name, email, timestamp, timezoneOffset };
}
async function normalizeCommitterObject({
  fs,
  gitdir,
  author,
  committer
}) {
  committer = Object.assign({}, committer || author);
  if (author) {
    committer.timestamp = committer.timestamp || author.timestamp;
    committer.timezoneOffset = committer.timezoneOffset || author.timezoneOffset;
  }
  committer = await normalizeAuthorObject({ fs, gitdir, author: committer });
  return committer;
}
async function addNote({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, ".git"),
  ref = "refs/notes/commits",
  oid,
  note,
  force,
  author: _author,
  committer: _committer,
  signingKey,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    assertParameter("note", note);
    if (signingKey) {
      assertParameter("onSign", onSign);
    const fs = new FileSystem(_fs);
    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author)
      throw new MissingNameError("author");
    const committer = await normalizeCommitterObject({
      author,
      committer: _committer
    if (!committer)
      throw new MissingNameError("committer");
    return await _addNote({
      fs: new FileSystem(fs),
      oid,
      note,
      force,
  } catch (err) {
    err.caller = "git.addNote";
    throw err;
  }
async function _addRemote({ fs, gitdir, remote, url, force }) {
  if (remote !== import_clean_git_ref.default.clean(remote)) {
    throw new InvalidRefNameError(remote, import_clean_git_ref.default.clean(remote));
  }
  const config = await GitConfigManager.get({ fs, gitdir });
  if (!force) {
    const remoteNames = await config.getSubsections("remote");
    if (remoteNames.includes(remote)) {
      if (url !== await config.get(`remote.${remote}.url`)) {
        throw new AlreadyExistsError("remote", remote);
      }
    }
  }
  await config.set(`remote.${remote}.url`, url);
  await config.set(`remote.${remote}.fetch`, `+refs/heads/*:refs/remotes/${remote}/*`);
  await GitConfigManager.save({ fs, gitdir, config });
async function addRemote({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  remote,
  url,
  force = false
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("remote", remote);
    assertParameter("url", url);
    return await _addRemote({
      fs: new FileSystem(fs),
      gitdir,
      remote,
      url,
      force
    });
  } catch (err) {
    err.caller = "git.addRemote";
    throw err;
  }
async function _annotatedTag({
  fs,
  cache,
  onSign,
  gitdir,
  ref,
  tagger,
  message = ref,
  gpgsig,
  object,
  signingKey,
  force = false
}) {
  ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
  if (!force && await GitRefManager.exists({ fs, gitdir, ref })) {
    throw new AlreadyExistsError("tag", ref);
  }
  const oid = await GitRefManager.resolve({
    ref: object || "HEAD"
  const { type } = await _readObject({ fs, cache, gitdir, oid });
  let tagObject = GitAnnotatedTag.from({
    object: oid,
    type,
    tag: ref.replace("refs/tags/", ""),
    tagger,
    message,
    gpgsig
  if (signingKey) {
    tagObject = await GitAnnotatedTag.sign(tagObject, onSign, signingKey);
  }
  const value = await _writeObject({
    type: "tag",
    object: tagObject.toObject()
  });
  await GitRefManager.writeRef({ fs, gitdir, ref, value });
}
async function annotatedTag({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  tagger: _tagger,
  message = ref,
  gpgsig,
  object,
  signingKey,
  force = false,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    if (signingKey) {
      assertParameter("onSign", onSign);
    const fs = new FileSystem(_fs);
    const tagger = await normalizeAuthorObject({ fs, gitdir, author: _tagger });
    if (!tagger)
      throw new MissingNameError("tagger");
    return await _annotatedTag({
      cache,
      onSign,
      ref,
      gpgsig,
      object,
      signingKey,
      force
  } catch (err) {
    err.caller = "git.annotatedTag";
    throw err;
  }
}
async function _branch({
  fs,
  gitdir,
  ref,
  object,
  checkout: checkout2 = false,
  force = false
}) {
  if (ref !== import_clean_git_ref.default.clean(ref)) {
    throw new InvalidRefNameError(ref, import_clean_git_ref.default.clean(ref));
  }
  const fullref = `refs/heads/${ref}`;
  if (!force) {
    const exist = await GitRefManager.exists({ fs, gitdir, ref: fullref });
    if (exist) {
      throw new AlreadyExistsError("branch", ref, false);
  }
  let oid;
  try {
    oid = await GitRefManager.resolve({ fs, gitdir, ref: object || "HEAD" });
  } catch (e) {
  }
  if (oid) {
    await GitRefManager.writeRef({ fs, gitdir, ref: fullref, value: oid });
  }
  if (checkout2) {
    await GitRefManager.writeSymbolicRef({
      ref: "HEAD",
      value: fullref
  }
async function branch({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  object,
  checkout: checkout2 = false,
  force = false
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    return await _branch({
      fs: new FileSystem(fs),
      gitdir,
      ref,
      object,
      checkout: checkout2,
      force
    });
  } catch (err) {
    err.caller = "git.branch";
    throw err;
  }
async function _walk({
  fs,
  cache,
  dir,
  gitdir,
  trees,
  map = async (_, entry) => entry,
  reduce = async (parent, children2) => {
    const flatten = flat(children2);
    if (parent !== void 0)
      flatten.unshift(parent);
    return flatten;
  },
  iterate = (walk2, children2) => Promise.all([...children2].map(walk2))
}) {
  const walkers = trees.map((proxy) => proxy[GitWalkSymbol]({ fs, dir, gitdir, cache }));
  const root = new Array(walkers.length).fill(".");
  const range = arrayRange(0, walkers.length);
  const unionWalkerFromReaddir = async (entries) => {
    range.map((i) => {
      entries[i] = entries[i] && new walkers[i].ConstructEntry(entries[i]);
    });
    const subdirs = await Promise.all(range.map((i) => entries[i] ? walkers[i].readdir(entries[i]) : []));
    const iterators = subdirs.map((array) => array === null ? [] : array).map((array) => array[Symbol.iterator]());
    return {
      entries,
      children: unionOfIterators(iterators)
    };
  };
  const walk2 = async (root2) => {
    const { entries, children: children2 } = await unionWalkerFromReaddir(root2);
    const fullpath = entries.find((entry) => entry && entry._fullpath)._fullpath;
    const parent = await map(fullpath, entries);
    if (parent !== null) {
      let walkedChildren = await iterate(walk2, children2);
      walkedChildren = walkedChildren.filter((x) => x !== void 0);
      return reduce(parent, walkedChildren);
    }
  };
  return walk2(root);
async function _checkout({
  fs,
  cache,
  onProgress,
  dir,
  gitdir,
  remote,
  ref,
  filepaths,
  noCheckout,
  noUpdateHead,
  dryRun,
  force,
  track = true
}) {
  let oid;
  try {
    oid = await GitRefManager.resolve({ fs, gitdir, ref });
  } catch (err) {
    if (ref === "HEAD")
      throw err;
    const remoteRef = `${remote}/${ref}`;
    oid = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: remoteRef
    });
    if (track) {
      const config = await GitConfigManager.get({ fs, gitdir });
      await config.set(`branch.${ref}.remote`, remote);
      await config.set(`branch.${ref}.merge`, `refs/heads/${ref}`);
      await GitConfigManager.save({ fs, gitdir, config });
    }
    await GitRefManager.writeRef({
      fs,
      gitdir,
      ref: `refs/heads/${ref}`,
      value: oid
    });
  }
  if (!noCheckout) {
    let ops;
      ops = await analyze({
        cache,
        onProgress,
        dir,
        ref,
        force,
        filepaths
    } catch (err) {
      if (err instanceof NotFoundError && err.data.what === oid) {
        throw new CommitNotFetchedError(ref, oid);
      } else {
        throw err;
    const conflicts2 = ops.filter(([method]) => method === "conflict").map(([method, fullpath]) => fullpath);
    if (conflicts2.length > 0) {
      throw new CheckoutConflictError(conflicts2);
    }
    const errors = ops.filter(([method]) => method === "error").map(([method, fullpath]) => fullpath);
    if (errors.length > 0) {
      throw new InternalError(errors.join(", "));
    }
    if (dryRun) {
      return;
    }
    let count = 0;
    const total = ops.length;
    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      await Promise.all(ops.filter(([method]) => method === "delete" || method === "delete-index").map(async function([method, fullpath]) {
        const filepath = `${dir}/${fullpath}`;
        if (method === "delete") {
          await fs.rm(filepath);
        }
        index2.delete({ filepath: fullpath });
        if (onProgress) {
          await onProgress({
            phase: "Updating workdir",
            loaded: ++count,
            total
          });
      }));
    });
    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      for (const [method, fullpath] of ops) {
        if (method === "rmdir" || method === "rmdir-index") {
          const filepath = `${dir}/${fullpath}`;
          try {
            if (method === "rmdir-index") {
            }
            await fs.rmdir(filepath);
            if (onProgress) {
              await onProgress({
                phase: "Updating workdir",
                loaded: ++count,
                total
              });
            }
          } catch (e) {
            if (e.code === "ENOTEMPTY") {
              console.log(`Did not delete ${fullpath} because directory is not empty`);
            } else {
              throw e;
        }
      }
    });
    await Promise.all(ops.filter(([method]) => method === "mkdir" || method === "mkdir-index").map(async function([_, fullpath]) {
      const filepath = `${dir}/${fullpath}`;
      await fs.mkdir(filepath);
      if (onProgress) {
        await onProgress({
          phase: "Updating workdir",
          loaded: ++count,
          total
      }
    }));
    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      await Promise.all(ops.filter(([method]) => method === "create" || method === "create-index" || method === "update" || method === "mkdir-index").map(async function([method, fullpath, oid2, mode, chmod]) {
        const filepath = `${dir}/${fullpath}`;
        try {
          if (method !== "create-index" && method !== "mkdir-index") {
            const { object } = await _readObject({ fs, cache, gitdir, oid: oid2 });
            if (chmod) {
              await fs.rm(filepath);
            }
            if (mode === 33188) {
              await fs.write(filepath, object);
            } else if (mode === 33261) {
              await fs.write(filepath, object, { mode: 511 });
            } else if (mode === 40960) {
              await fs.writelink(filepath, object);
            } else {
              throw new InternalError(`Invalid mode 0o${mode.toString(8)} detected in blob ${oid2}`);
            }
          }
          const stats = await fs.lstat(filepath);
          if (mode === 33261) {
            stats.mode = 493;
          }
          if (method === "mkdir-index") {
            stats.mode = 57344;
          }
          index2.insert({
            filepath: fullpath,
            stats,
            oid: oid2
          });
            await onProgress({
        } catch (e) {
          console.log(e);
        }
    });
  }
  if (!noUpdateHead) {
    const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
    if (fullRef.startsWith("refs/heads")) {
      await GitRefManager.writeSymbolicRef({
        fs,
        gitdir,
        ref: "HEAD",
        value: fullRef
    } else {
      await GitRefManager.writeRef({ fs, gitdir, ref: "HEAD", value: oid });
  }
async function analyze({
  fs,
  cache,
  onProgress,
  dir,
  gitdir,
  ref,
  force,
  filepaths
}) {
  let count = 0;
  return _walk({
    trees: [TREE({ ref }), WORKDIR(), STAGE()],
    map: async function(fullpath, [commit2, workdir, stage]) {
      if (fullpath === ".")
        return;
      if (filepaths && !filepaths.some((base) => worthWalking(fullpath, base))) {
        return null;
      }
      if (onProgress) {
        await onProgress({ phase: "Analyzing workdir", loaded: ++count });
      }
      const key2 = [!!stage, !!commit2, !!workdir].map(Number).join("");
      switch (key2) {
        case "000":
          return;
        case "001":
          if (force && filepaths && filepaths.includes(fullpath)) {
            return ["delete", fullpath];
          return;
        case "010": {
          switch (await commit2.type()) {
            case "tree": {
              return ["mkdir", fullpath];
            }
            case "blob": {
              return [
                "create",
                fullpath,
                await commit2.oid(),
                await commit2.mode()
              ];
            }
            case "commit": {
              return [
                "mkdir-index",
                fullpath,
                await commit2.oid(),
                await commit2.mode()
              ];
            }
            default: {
              return [
                "error",
                `new entry Unhandled type ${await commit2.type()}`
              ];
            }
        }
        case "011": {
          switch (`${await commit2.type()}-${await workdir.type()}`) {
            case "tree-tree": {
            }
            case "tree-blob":
            case "blob-tree": {
              return ["conflict", fullpath];
            }
            case "blob-blob": {
              if (await commit2.oid() !== await workdir.oid()) {
                if (force) {
                    "update",
                    await commit2.oid(),
                    await commit2.mode(),
                    await commit2.mode() !== await workdir.mode()
                } else {
                  return ["conflict", fullpath];
              } else {
                if (await commit2.mode() !== await workdir.mode()) {
                  if (force) {
                    return [
                      "update",
                      fullpath,
                      await commit2.oid(),
                      await commit2.mode(),
                      true
                    ];
                  } else {
                    return ["conflict", fullpath];
                  }
                } else {
                    "create-index",
                    await commit2.oid(),
                    await commit2.mode()
            case "commit-tree": {
              return;
            }
            case "commit-blob": {
              return ["conflict", fullpath];
            }
            default: {
              return ["error", `new entry Unhandled type ${commit2.type}`];
            }
          }
        }
        case "100": {
          return ["delete-index", fullpath];
        }
        case "101": {
          switch (await stage.type()) {
            case "tree": {
              return ["rmdir", fullpath];
            }
            case "blob": {
              if (await stage.oid() !== await workdir.oid()) {
                if (force) {
                  return ["delete", fullpath];
                } else {
              } else {
                return ["delete", fullpath];
            case "commit": {
              return ["rmdir-index", fullpath];
            default: {
              return [
                "error",
                `delete entry Unhandled type ${await stage.type()}`
              ];
          }
        }
        case "110":
        case "111": {
          switch (`${await stage.type()}-${await commit2.type()}`) {
            case "tree-tree": {
              return;
            }
            case "blob-blob": {
              if (await stage.oid() === await commit2.oid() && await stage.mode() === await commit2.mode() && !force) {
                return;
              }
              if (workdir) {
                if (await workdir.oid() !== await stage.oid() && await workdir.oid() !== await commit2.oid()) {
                  if (force) {
                      await commit2.oid(),
                      await commit2.mode(),
                      await commit2.mode() !== await workdir.mode()
                    return ["conflict", fullpath];
              } else if (force) {
                return [
                  "update",
                  fullpath,
                  await commit2.oid(),
                  await commit2.mode(),
                  await commit2.mode() !== await stage.mode()
                ];
              }
              if (await commit2.mode() !== await stage.mode()) {
                return [
                  "update",
                  fullpath,
                  await commit2.oid(),
                  await commit2.mode(),
                  true
                ];
              }
              if (await commit2.oid() !== await stage.oid()) {
                return [
                  "update",
                  fullpath,
                  await commit2.oid(),
                  await commit2.mode(),
                  false
                ];
              } else {
                return;
            case "tree-blob": {
              return ["update-dir-to-blob", fullpath, await commit2.oid()];
            }
            case "blob-tree": {
              return ["update-blob-to-tree", fullpath];
            }
            case "commit-commit": {
              return [
                "mkdir-index",
                fullpath,
                await commit2.oid(),
                await commit2.mode()
              ];
            }
            default: {
              return [
                "error",
                `update entry Unhandled type ${await stage.type()}-${await commit2.type()}`
              ];
            }
        }
      }
    },
    reduce: async function(parent, children2) {
      children2 = flat(children2);
      if (!parent) {
        return children2;
      } else if (parent && parent[0] === "rmdir") {
        children2.push(parent);
        return children2;
      } else {
        children2.unshift(parent);
        return children2;
async function checkout({
  fs,
  onProgress,
  dir,
  gitdir = join(dir, ".git"),
  remote = "origin",
  ref: _ref,
  filepaths,
  noCheckout = false,
  noUpdateHead = _ref === void 0,
  dryRun = false,
  force = false,
  track = true,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("dir", dir);
    assertParameter("gitdir", gitdir);
    const ref = _ref || "HEAD";
    return await _checkout({
      fs: new FileSystem(fs),
      cache,
      onProgress,
      dir,
      gitdir,
      remote,
      ref,
      filepaths,
      noCheckout,
      noUpdateHead,
      dryRun,
      force,
      track
    });
  } catch (err) {
    err.caller = "git.checkout";
    throw err;
  }
}
async function _currentBranch({
  fs,
  gitdir,
  fullname = false,
  test = false
}) {
  const ref = await GitRefManager.resolve({
    ref: "HEAD",
    depth: 2
  if (test) {
    try {
      await GitRefManager.resolve({ fs, gitdir, ref });
    } catch (_) {
      return;
    }
  }
  if (!ref.startsWith("refs/"))
    return;
  return fullname ? ref : abbreviateRef(ref);
async function forAwait(iterable, cb) {
  const iter = getIterator(iterable);
  while (true) {
    const { value, done } = await iter.next();
    if (value)
      await cb(value);
    if (done)
      break;
  }
  if (iter.return)
    iter.return();
async function collect(iterable) {
  let size = 0;
  const buffers = [];
  await forAwait(iterable, (value) => {
    buffers.push(value);
    size += value.byteLength;
  const result = new Uint8Array(size);
  let nextIndex = 0;
  for (const buffer2 of buffers) {
    result.set(buffer2, nextIndex);
    nextIndex += buffer2.byteLength;
  }
  return result;
    return async function read() {
      try {
        let length = await reader.read(4);
        if (length == null)
        length = parseInt(length.toString("utf8"), 16);
        if (length === 0)
          return null;
        if (length === 1)
          return null;
        const buffer2 = await reader.read(length - 4);
        if (buffer2 == null)
          return true;
        return buffer2;
      } catch (err) {
        console.log("error", err);
        return true;
      }
async function parseCapabilitiesV2(read) {
  const capabilities2 = {};
  let line;
  while (true) {
    line = await read();
    if (line === true)
      break;
    if (line === null)
      continue;
    line = line.toString("utf8").replace(/\n$/, "");
    const i = line.indexOf("=");
    if (i > -1) {
      const key2 = line.slice(0, i);
      const value = line.slice(i + 1);
      capabilities2[key2] = value;
    } else {
      capabilities2[line] = true;
    }
  }
  return { protocolVersion: 2, capabilities2 };
}
async function parseRefsAdResponse(stream, { service }) {
  const capabilities = new Set();
  const refs = new Map();
  const symrefs = new Map();
  const read = GitPktLine.streamReader(stream);
  let lineOne = await read();
  while (lineOne === null)
    lineOne = await read();
  if (lineOne === true)
    throw new EmptyServerResponseError();
  if (lineOne.includes("version 2")) {
    return parseCapabilitiesV2(read);
  }
  if (lineOne.toString("utf8").replace(/\n$/, "") !== `# service=${service}`) {
    throw new ParseError(`# service=${service}\\n`, lineOne.toString("utf8"));
  }
  let lineTwo = await read();
  while (lineTwo === null)
    lineTwo = await read();
  if (lineTwo === true)
    return { capabilities, refs, symrefs };
  lineTwo = lineTwo.toString("utf8");
  if (lineTwo.includes("version 2")) {
    return parseCapabilitiesV2(read);
  }
  const [firstRef, capabilitiesLine] = splitAndAssert(lineTwo, "\0", "\\x00");
  capabilitiesLine.split(" ").map((x) => capabilities.add(x));
  const [ref, name] = splitAndAssert(firstRef, " ", " ");
  refs.set(name, ref);
  while (true) {
    const line = await read();
    if (line === true)
      break;
    if (line !== null) {
      const [ref2, name2] = splitAndAssert(line.toString("utf8"), " ", " ");
      refs.set(name2, ref2);
  }
  for (const cap of capabilities) {
    if (cap.startsWith("symref=")) {
      const m = cap.match(/symref=([^:]+):(.*)/);
      if (m.length === 3) {
        symrefs.set(m[1], m[2]);
  }
  return { protocolVersion: 1, capabilities, refs, symrefs };
var stringifyBody = async (res) => {
    const data = Buffer2.from(await collect(res.body));
};
  static async capabilities() {
    return ["discover", "connect"];
  static async discover({
    http,
    onProgress,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    corsProxy,
    service,
    url: _origUrl,
    headers,
    protocolVersion
  }) {
    let { url, auth } = extractAuthFromUrl(_origUrl);
    const proxifiedURL = corsProxy ? corsProxify(corsProxy, url) : url;
    if (auth.username || auth.password) {
      headers.Authorization = calculateBasicAuthHeader(auth);
    }
    if (protocolVersion === 2) {
      headers["Git-Protocol"] = "version=2";
    }
    let res;
    let tryAgain;
    let providedAuthBefore = false;
    do {
      res = await http.request({
        onProgress,
        method: "GET",
        url: `${proxifiedURL}/info/refs?service=${service}`,
        headers
      });
      tryAgain = false;
      if (res.statusCode === 401 || res.statusCode === 203) {
        const getAuth = providedAuthBefore ? onAuthFailure : onAuth;
        if (getAuth) {
          auth = await getAuth(url, {
            ...auth,
            headers: { ...headers }
          });
          if (auth && auth.cancel) {
            throw new UserCanceledError();
          } else if (auth) {
            updateHeaders(headers, auth);
            providedAuthBefore = true;
            tryAgain = true;
      } else if (res.statusCode === 200 && providedAuthBefore && onAuthSuccess) {
        await onAuthSuccess(url, auth);
    } while (tryAgain);
    if (res.statusCode !== 200) {
      const { response } = await stringifyBody(res);
      throw new HttpError(res.statusCode, res.statusMessage, response);
    }
    if (res.headers["content-type"] === `application/x-${service}-advertisement`) {
      const remoteHTTP = await parseRefsAdResponse(res.body, { service });
      remoteHTTP.auth = auth;
      return remoteHTTP;
    } else {
      const { preview, response, data } = await stringifyBody(res);
      try {
        const remoteHTTP = await parseRefsAdResponse([data], { service });
      } catch (e) {
        throw new SmartHttpError(preview, response);
    }
  static async connect({
    http,
    onProgress,
    corsProxy,
    service,
    url,
    auth,
    body,
    headers
  }) {
    const urlAuth = extractAuthFromUrl(url);
    if (urlAuth)
      url = urlAuth.url;
    if (corsProxy)
      url = corsProxify(corsProxy, url);
    headers["content-type"] = `application/x-${service}-request`;
    headers.accept = `application/x-${service}-result`;
    updateHeaders(headers, auth);
    const res = await http.request({
      method: "POST",
      url: `${url}/${service}`,
    if (res.statusCode !== 200) {
      const { response } = stringifyBody(res);
      throw new HttpError(res.statusCode, res.statusMessage, response);
    }
    return res;
  static async read({ fs, gitdir }) {
    if (lock$1 === null)
      lock$1 = new import_async_lock.default();
    const filepath = join(gitdir, "shallow");
    const oids = new Set();
    await lock$1.acquire(filepath, async function() {
      const text2 = await fs.read(filepath, { encoding: "utf8" });
      if (text2 === null)
        return oids;
      if (text2.trim() === "")
        return oids;
      text2.trim().split("\n").map((oid) => oids.add(oid));
    });
    return oids;
  }
  static async write({ fs, gitdir, oids }) {
    if (lock$1 === null)
      lock$1 = new import_async_lock.default();
    const filepath = join(gitdir, "shallow");
    if (oids.size > 0) {
      const text2 = [...oids].join("\n") + "\n";
      await lock$1.acquire(filepath, async function() {
        await fs.write(filepath, text2, {
          encoding: "utf8"
    } else {
      await lock$1.acquire(filepath, async function() {
        await fs.rm(filepath);
      });
    }
  }
};
async function hasObjectLoose({ fs, gitdir, oid }) {
  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
  return fs.exists(`${gitdir}/${source}`);
}
async function hasObjectPacked({
  fs,
  cache,
  gitdir,
  oid,
  getExternalRefDelta
}) {
  let list = await fs.readdir(join(gitdir, "objects/pack"));
  list = list.filter((x) => x.endsWith(".idx"));
  for (const filename of list) {
    const indexFile = `${gitdir}/objects/pack/${filename}`;
    const p = await readPackIndex({
      fs,
      cache,
      filename: indexFile,
      getExternalRefDelta
    if (p.error)
      throw new InternalError(p.error);
    if (p.offsets.has(oid)) {
      return true;
    }
  return false;
}
async function hasObject({
  fs,
  cache,
  gitdir,
  oid,
  format = "content"
}) {
  const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
  let result = await hasObjectLoose({ fs, gitdir, oid });
  if (!result) {
    result = await hasObjectPacked({
      fs,
      cache,
      gitdir,
      oid,
      getExternalRefDelta
  return result;
}
function emptyPackfile(pack) {
  const pheader = "5041434b";
  const version2 = "00000002";
  const obCount = "00000000";
  const header = pheader + version2 + obCount;
  return pack.slice(0, 12).toString("hex") === header;
}
function filterCapabilities(server, client) {
  const serverNames = server.map((cap) => cap.split("=", 1)[0]);
  return client.filter((cap) => {
    const name = cap.split("=", 1)[0];
    return serverNames.includes(name);
  async next() {
    if (this._queue.length > 0) {
      return { value: this._queue.shift() };
    }
    if (this._ended) {
      return { done: true };
    }
    if (this._waiting) {
      throw Error("You cannot call read until the previous call to read has returned!");
    }
    return new Promise((resolve) => {
      this._waiting = resolve;
  (async () => {
    await forAwait(input, (chunk) => {
  })();
    const nextBit = async function() {
      const line = await read();
      if (line === null)
        return nextBit();
      if (line === true) {
        packetlines.end();
        progress.end();
        packfile.end();
        return;
      }
      switch (line[0]) {
        case 1: {
          packfile.write(line.slice(1));
          break;
        }
        case 2: {
          progress.write(line.slice(1));
          break;
        }
        case 3: {
          const error = line.slice(1);
          progress.write(error);
          packfile.destroy(new Error(error.toString("utf8")));
        default: {
          packetlines.write(line.slice(0));
      }
      nextBit();
async function parseUploadPackResponse(stream) {
  const { packetlines, packfile, progress } = GitSideBand.demux(stream);
  const shallows = [];
  const unshallows = [];
  const acks = [];
  let nak = false;
  let done = false;
  return new Promise((resolve, reject) => {
    forAwait(packetlines, (data) => {
      const line = data.toString("utf8").trim();
      if (line.startsWith("shallow")) {
        const oid = line.slice(-41).trim();
        if (oid.length !== 40) {
          reject(new InvalidOidError(oid));
        }
        shallows.push(oid);
      } else if (line.startsWith("unshallow")) {
        const oid = line.slice(-41).trim();
        if (oid.length !== 40) {
          reject(new InvalidOidError(oid));
        }
        unshallows.push(oid);
      } else if (line.startsWith("ACK")) {
        const [, oid, status2] = line.split(" ");
        acks.push({ oid, status: status2 });
        if (!status2)
      } else if (line.startsWith("NAK")) {
        nak = true;
        done = true;
      }
      if (done) {
        resolve({ shallows, unshallows, acks, nak, packfile, progress });
      }
async function _fetch({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  gitdir,
  ref: _ref,
  remoteRef: _remoteRef,
  remote: _remote,
  url: _url,
  corsProxy,
  depth = null,
  since = null,
  exclude = [],
  relative = false,
  tags = false,
  singleBranch = false,
  headers = {},
  prune = false,
  pruneTags = false
}) {
  const ref = _ref || await _currentBranch({ fs, gitdir, test: true });
  const config = await GitConfigManager.get({ fs, gitdir });
  const remote = _remote || ref && await config.get(`branch.${ref}.remote`) || "origin";
  const url = _url || await config.get(`remote.${remote}.url`);
  if (typeof url === "undefined") {
    throw new MissingParameterError("remote OR url");
  }
  const remoteRef = _remoteRef || ref && await config.get(`branch.${ref}.merge`) || _ref || "HEAD";
  if (corsProxy === void 0) {
    corsProxy = await config.get("http.corsProxy");
  }
  const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
  const remoteHTTP = await GitRemoteHTTP2.discover({
    service: "git-upload-pack",
    url,
    headers,
    protocolVersion: 1
  });
  const auth = remoteHTTP.auth;
  const remoteRefs = remoteHTTP.refs;
  if (remoteRefs.size === 0) {
    return {
      defaultBranch: null,
      fetchHead: null,
      fetchHeadDescription: null
    };
  }
  if (depth !== null && !remoteHTTP.capabilities.has("shallow")) {
    throw new RemoteCapabilityError("shallow", "depth");
  }
  if (since !== null && !remoteHTTP.capabilities.has("deepen-since")) {
    throw new RemoteCapabilityError("deepen-since", "since");
  }
  if (exclude.length > 0 && !remoteHTTP.capabilities.has("deepen-not")) {
    throw new RemoteCapabilityError("deepen-not", "exclude");
  }
  if (relative === true && !remoteHTTP.capabilities.has("deepen-relative")) {
    throw new RemoteCapabilityError("deepen-relative", "relative");
  }
  const { oid, fullref } = GitRefManager.resolveAgainstMap({
    ref: remoteRef,
    map: remoteRefs
  });
  for (const remoteRef2 of remoteRefs.keys()) {
    if (remoteRef2 === fullref || remoteRef2 === "HEAD" || remoteRef2.startsWith("refs/heads/") || tags && remoteRef2.startsWith("refs/tags/")) {
      continue;
    remoteRefs.delete(remoteRef2);
  }
  const capabilities = filterCapabilities([...remoteHTTP.capabilities], [
    "multi_ack_detailed",
    "no-done",
    "side-band-64k",
    "ofs-delta",
    `agent=${pkg.agent}`
  ]);
  if (relative)
    capabilities.push("deepen-relative");
  const wants = singleBranch ? [oid] : remoteRefs.values();
  const haveRefs = singleBranch ? [ref] : await GitRefManager.listRefs({
    fs,
    gitdir,
    filepath: `refs`
  });
  let haves = [];
  for (let ref2 of haveRefs) {
    try {
      ref2 = await GitRefManager.expand({ fs, gitdir, ref: ref2 });
      const oid2 = await GitRefManager.resolve({ fs, gitdir, ref: ref2 });
      if (await hasObject({ fs, cache, gitdir, oid: oid2 })) {
        haves.push(oid2);
      }
    } catch (err) {
  }
  haves = [...new Set(haves)];
  const oids = await GitShallowManager.read({ fs, gitdir });
  const shallows = remoteHTTP.capabilities.has("shallow") ? [...oids] : [];
  const packstream = writeUploadPackRequest({
    capabilities,
    wants,
    haves,
    shallows,
    depth,
    since,
    exclude
  });
  const packbuffer = Buffer2.from(await collect(packstream));
  const raw = await GitRemoteHTTP2.connect({
    http,
    onProgress,
    corsProxy,
    service: "git-upload-pack",
    url,
    auth,
    body: [packbuffer],
    headers
  });
  const response = await parseUploadPackResponse(raw.body);
  if (raw.headers) {
    response.headers = raw.headers;
  }
  for (const oid2 of response.shallows) {
    if (!oids.has(oid2)) {
      try {
        const { object } = await _readObject({ fs, cache, gitdir, oid: oid2 });
        const commit2 = new GitCommit(object);
        const hasParents = await Promise.all(commit2.headers().parent.map((oid3) => hasObject({ fs, cache, gitdir, oid: oid3 })));
        const haveAllParents = hasParents.length === 0 || hasParents.every((has) => has);
        if (!haveAllParents) {
          oids.add(oid2);
        }
      } catch (err) {
        oids.add(oid2);
      }
  }
  for (const oid2 of response.unshallows) {
    oids.delete(oid2);
  }
  await GitShallowManager.write({ fs, gitdir, oids });
  if (singleBranch) {
    const refs = new Map([[fullref, oid]]);
    const symrefs = new Map();
    let bail = 10;
    let key2 = fullref;
    while (bail--) {
      const value = remoteHTTP.symrefs.get(key2);
      if (value === void 0)
        break;
      symrefs.set(key2, value);
      key2 = value;
    const realRef = remoteRefs.get(key2);
    if (realRef) {
      refs.set(key2, realRef);
    const { pruned } = await GitRefManager.updateRemoteRefs({
      fs,
      gitdir,
      remote,
      refs,
      symrefs,
      tags,
      prune
    if (prune) {
      response.pruned = pruned;
  } else {
    const { pruned } = await GitRefManager.updateRemoteRefs({
      remote,
      refs: remoteRefs,
      symrefs: remoteHTTP.symrefs,
      tags,
      prune,
      pruneTags
    if (prune) {
      response.pruned = pruned;
  }
  response.HEAD = remoteHTTP.symrefs.get("HEAD");
  if (response.HEAD === void 0) {
    const { oid: oid2 } = GitRefManager.resolveAgainstMap({
      ref: "HEAD",
      map: remoteRefs
    for (const [key2, value] of remoteRefs.entries()) {
      if (key2 !== "HEAD" && value === oid2) {
        response.HEAD = key2;
        break;
  }
  const noun = fullref.startsWith("refs/tags") ? "tag" : "branch";
  response.FETCH_HEAD = {
    oid,
    description: `${noun} '${abbreviateRef(fullref)}' of ${url}`
  };
  if (onProgress || onMessage) {
    const lines = splitLines(response.progress);
    forAwait(lines, async (line) => {
      if (onMessage)
        await onMessage(line);
      if (onProgress) {
        const matches = line.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
        if (matches) {
          await onProgress({
            phase: matches[1].trim(),
            loaded: parseInt(matches[2], 10),
            total: parseInt(matches[3], 10)
          });
    });
  }
  const packfile = Buffer2.from(await collect(response.packfile));
  const packfileSha = packfile.slice(-20).toString("hex");
  const res = {
    defaultBranch: response.HEAD,
    fetchHead: response.FETCH_HEAD.oid,
    fetchHeadDescription: response.FETCH_HEAD.description
  };
  if (response.headers) {
    res.headers = response.headers;
  }
  if (prune) {
    res.pruned = response.pruned;
  }
  if (packfileSha !== "" && !emptyPackfile(packfile)) {
    res.packfile = `objects/pack/pack-${packfileSha}.pack`;
    const fullpath = join(gitdir, res.packfile);
    await fs.write(fullpath, packfile);
    const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
    const idx = await GitPackIndex.fromPack({
      pack: packfile,
      getExternalRefDelta,
      onProgress
    });
    await fs.write(fullpath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
  }
  return res;
async function _init({
  fs,
  bare = false,
  dir,
  gitdir = bare ? dir : join(dir, ".git"),
  defaultBranch = "master"
}) {
  if (await fs.exists(gitdir + "/config"))
    return;
  let folders = [
    "hooks",
    "info",
    "objects/info",
    "objects/pack",
    "refs/heads",
    "refs/tags"
  ];
  folders = folders.map((dir2) => gitdir + "/" + dir2);
  for (const folder of folders) {
    await fs.mkdir(folder);
  }
  await fs.write(gitdir + "/config", `[core]
  await fs.write(gitdir + "/HEAD", `ref: refs/heads/${defaultBranch}
async function _clone({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir,
  url,
  corsProxy,
  ref,
  remote,
  depth,
  since,
  exclude,
  relative,
  singleBranch,
  noCheckout,
  noTags,
  headers
}) {
  try {
    await _init({ fs, gitdir });
    await _addRemote({ fs, gitdir, remote, url, force: false });
    if (corsProxy) {
      const config = await GitConfigManager.get({ fs, gitdir });
      await config.set(`http.corsProxy`, corsProxy);
      await GitConfigManager.save({ fs, gitdir, config });
    }
    const { defaultBranch, fetchHead } = await _fetch({
      fs,
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      ref,
      remote,
      corsProxy,
      depth,
      since,
      exclude,
      relative,
      singleBranch,
      headers,
      tags: !noTags
    });
    if (fetchHead === null)
      return;
    ref = ref || defaultBranch;
    ref = ref.replace("refs/heads/", "");
    await _checkout({
      fs,
      cache,
      onProgress,
      dir,
      gitdir,
      ref,
      remote,
      noCheckout
    });
  } catch (err) {
    await fs.rmdir(gitdir, { recursive: true, maxRetries: 10 }).catch(() => void 0);
    throw err;
  }
async function clone({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, ".git"),
  url,
  corsProxy = void 0,
  ref = void 0,
  remote = "origin",
  depth = void 0,
  since = void 0,
  exclude = [],
  relative = false,
  singleBranch = false,
  noCheckout = false,
  noTags = false,
  headers = {},
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("http", http);
    assertParameter("gitdir", gitdir);
    if (!noCheckout) {
      assertParameter("dir", dir);
    assertParameter("url", url);
    return await _clone({
      fs: new FileSystem(fs),
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir,
      url,
      corsProxy,
      ref,
      remote,
      depth,
      since,
      exclude,
      relative,
      singleBranch,
      noCheckout,
      noTags,
      headers
    });
  } catch (err) {
    err.caller = "git.clone";
    throw err;
  }
async function commit({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, ".git"),
  message,
  author: _author,
  committer: _committer,
  signingKey,
  dryRun = false,
  noUpdateBranch = false,
  ref,
  parent,
  tree,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("message", message);
    if (signingKey) {
      assertParameter("onSign", onSign);
    const fs = new FileSystem(_fs);
    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author)
      throw new MissingNameError("author");
    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer
    });
    if (!committer)
      throw new MissingNameError("committer");
    return await _commit({
      fs,
      cache,
      onSign,
      gitdir,
      message,
      author,
      committer,
      signingKey,
      dryRun,
      noUpdateBranch,
      ref,
      parent,
      tree
    });
  } catch (err) {
    err.caller = "git.commit";
    throw err;
  }
async function currentBranch({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  fullname = false,
  test = false
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    return await _currentBranch({
      fs: new FileSystem(fs),
      gitdir,
      fullname,
      test
    });
  } catch (err) {
    err.caller = "git.currentBranch";
    throw err;
  }
async function _deleteBranch({ fs, gitdir, ref }) {
  const exist = await GitRefManager.exists({ fs, gitdir, ref });
  if (!exist) {
    throw new NotFoundError(ref);
  }
  const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
  const currentRef = await _currentBranch({ fs, gitdir, fullname: true });
  if (fullRef === currentRef) {
    const value = await GitRefManager.resolve({ fs, gitdir, ref: fullRef });
    await GitRefManager.writeRef({ fs, gitdir, ref: "HEAD", value });
  }
  await GitRefManager.deleteRef({ fs, gitdir, ref: fullRef });
async function deleteBranch({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  ref
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("ref", ref);
    return await _deleteBranch({
      fs: new FileSystem(fs),
      gitdir,
      ref
    });
  } catch (err) {
    err.caller = "git.deleteBranch";
    throw err;
  }
async function deleteRef({ fs, dir, gitdir = join(dir, ".git"), ref }) {
  try {
    assertParameter("fs", fs);
    assertParameter("ref", ref);
    await GitRefManager.deleteRef({ fs: new FileSystem(fs), gitdir, ref });
  } catch (err) {
    err.caller = "git.deleteRef";
    throw err;
  }
async function _deleteRemote({ fs, gitdir, remote }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  await config.deleteSection("remote", remote);
  await GitConfigManager.save({ fs, gitdir, config });
async function deleteRemote({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  remote
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("remote", remote);
    return await _deleteRemote({
      fs: new FileSystem(fs),
      gitdir,
      remote
    });
  } catch (err) {
    err.caller = "git.deleteRemote";
    throw err;
  }
async function _deleteTag({ fs, gitdir, ref }) {
  ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
  await GitRefManager.deleteRef({ fs, gitdir, ref });
async function deleteTag({ fs, dir, gitdir = join(dir, ".git"), ref }) {
  try {
    assertParameter("fs", fs);
    assertParameter("ref", ref);
    return await _deleteTag({
      fs: new FileSystem(fs),
      gitdir,
      ref
    });
  } catch (err) {
    err.caller = "git.deleteTag";
    throw err;
  }
async function expandOidLoose({ fs, gitdir, oid: short }) {
  const prefix = short.slice(0, 2);
  const objectsSuffixes = await fs.readdir(`${gitdir}/objects/${prefix}`);
  return objectsSuffixes.map((suffix) => `${prefix}${suffix}`).filter((_oid) => _oid.startsWith(short));
}
async function expandOidPacked({
  fs,
  cache,
  gitdir,
  oid: short,
  getExternalRefDelta
}) {
  const results = [];
  let list = await fs.readdir(join(gitdir, "objects/pack"));
  list = list.filter((x) => x.endsWith(".idx"));
  for (const filename of list) {
    const indexFile = `${gitdir}/objects/pack/${filename}`;
    const p = await readPackIndex({
      fs,
      cache,
      filename: indexFile,
      getExternalRefDelta
    });
    if (p.error)
      throw new InternalError(p.error);
    for (const oid of p.offsets.keys()) {
      if (oid.startsWith(short))
        results.push(oid);
    }
  }
  return results;
async function _expandOid({ fs, cache, gitdir, oid: short }) {
  const getExternalRefDelta = (oid) => _readObject({ fs, cache, gitdir, oid });
  const results1 = await expandOidLoose({ fs, gitdir, oid: short });
  const results2 = await expandOidPacked({
  const results = results1.concat(results2);
  if (results.length === 1) {
    return results[0];
  }
  if (results.length > 1) {
    throw new AmbiguousError("oids", short, results);
  }
  throw new NotFoundError(`an object matching "${short}"`);
async function expandOid({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oid,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    return await _expandOid({
      fs: new FileSystem(fs),
      oid
    });
  } catch (err) {
    err.caller = "git.expandOid";
    throw err;
  }
}
async function expandRef({ fs, dir, gitdir = join(dir, ".git"), ref }) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    return await GitRefManager.expand({
      fs: new FileSystem(fs),
      gitdir,
      ref
  } catch (err) {
    err.caller = "git.expandRef";
    throw err;
  }
}
async function _findMergeBase({ fs, cache, gitdir, oids }) {
  const visits = {};
  const passes = oids.length;
  let heads = oids.map((oid, index2) => ({ index: index2, oid }));
  while (heads.length) {
    const result = new Set();
    for (const { oid, index: index2 } of heads) {
      if (!visits[oid])
        visits[oid] = new Set();
      visits[oid].add(index2);
      if (visits[oid].size === passes) {
        result.add(oid);
      }
    if (result.size > 0) {
      return [...result];
    const newheads = new Map();
    for (const { oid, index: index2 } of heads) {
      try {
        const { object } = await _readObject({ fs, cache, gitdir, oid });
        const commit2 = GitCommit.from(object);
        const { parent } = commit2.parseHeaders();
        for (const oid2 of parent) {
          if (!visits[oid2] || !visits[oid2].has(index2)) {
            newheads.set(oid2 + ":" + index2, { oid: oid2, index: index2 });
      } catch (err) {
    heads = Array.from(newheads.values());
  }
  return [];
async function mergeTree({
  fs,
  cache,
  dir,
  gitdir = join(dir, ".git"),
  ourOid,
  baseOid,
  theirOid,
  ourName = "ours",
  baseName = "base",
  theirName = "theirs",
  dryRun = false,
  abortOnConflict = true,
  mergeDriver
}) {
  const ourTree = TREE({ ref: ourOid });
  const baseTree = TREE({ ref: baseOid });
  const theirTree = TREE({ ref: theirOid });
  const unmergedFiles = [];
  let cleanMerge = true;
  const results = await _walk({
    gitdir,
    trees: [ourTree, baseTree, theirTree],
    map: async function(filepath, [ours, base, theirs]) {
      const path2 = basename(filepath);
      const ourChange = await modified(ours, base);
      const theirChange = await modified(theirs, base);
      switch (`${ourChange}-${theirChange}`) {
        case "false-false": {
          return {
            mode: await base.mode(),
            path: path2,
            oid: await base.oid(),
            type: await base.type()
          };
        }
        case "false-true": {
          return theirs ? {
            mode: await theirs.mode(),
            path: path2,
            oid: await theirs.oid(),
            type: await theirs.type()
          } : void 0;
        }
        case "true-false": {
          return ours ? {
            mode: await ours.mode(),
            path: path2,
            oid: await ours.oid(),
            type: await ours.type()
          } : void 0;
        }
        case "true-true": {
          if (ours && base && theirs && await ours.type() === "blob" && await base.type() === "blob" && await theirs.type() === "blob") {
            return mergeBlobs({
              fs,
              gitdir,
              path: path2,
              ours,
              base,
              theirs,
              ourName,
              baseName,
              theirName,
              mergeDriver
            }).then((r) => {
              cleanMerge = cleanMerge && r.cleanMerge;
              unmergedFiles.push(filepath);
              return r.mergeResult;
            });
          throw new MergeNotSupportedError();
      }
    },
    reduce: async (parent, children2) => {
      const entries = children2.filter(Boolean);
      if (!parent)
        return;
      if (parent && parent.type === "tree" && entries.length === 0)
        return;
      if (entries.length > 0) {
        const tree = new GitTree(entries);
        const object = tree.toObject();
        const oid = await _writeObject({
          type: "tree",
          object,
          dryRun
        parent.oid = oid;
      return parent;
  if (!cleanMerge) {
    if (dir && !abortOnConflict) {
      await _walk({
        fs,
        cache,
        dir,
        gitdir,
        trees: [TREE({ ref: results.oid })],
        map: async function(filepath, [entry]) {
          const path2 = `${dir}/${filepath}`;
          if (await entry.type() === "blob") {
            const mode = await entry.mode();
            const content = new TextDecoder().decode(await entry.content());
            await fs.write(path2, content, { mode });
          }
          return true;
        }
      });
    throw new MergeConflictError(unmergedFiles);
  }
  return results.oid;
}
async function modified(entry, base) {
  if (!entry && !base)
    return false;
  if (entry && !base)
  if (!entry && base)
    return true;
  if (await entry.type() === "tree" && await base.type() === "tree") {
    return false;
  }
  if (await entry.type() === await base.type() && await entry.mode() === await base.mode() && await entry.oid() === await base.oid()) {
    return false;
  }
  return true;
}
async function mergeBlobs({
  fs,
  gitdir,
  path: path2,
  ours,
  base,
  theirs,
  ourName,
  theirName,
  baseName,
  dryRun,
  mergeDriver = mergeFile
}) {
  const type = "blob";
  const mode = await base.mode() === await ours.mode() ? await theirs.mode() : await ours.mode();
  if (await ours.oid() === await theirs.oid()) {
    return {
      cleanMerge: true,
      mergeResult: { mode, path: path2, oid: await ours.oid(), type }
    };
  }
  if (await ours.oid() === await base.oid()) {
    return {
      cleanMerge: true,
      mergeResult: { mode, path: path2, oid: await theirs.oid(), type }
    };
  }
  if (await theirs.oid() === await base.oid()) {
    return {
      cleanMerge: true,
      mergeResult: { mode, path: path2, oid: await ours.oid(), type }
    };
  }
  const ourContent = Buffer2.from(await ours.content()).toString("utf8");
  const baseContent = Buffer2.from(await base.content()).toString("utf8");
  const theirContent = Buffer2.from(await theirs.content()).toString("utf8");
  const { mergedText, cleanMerge } = await mergeDriver({
    branches: [baseName, ourName, theirName],
    contents: [baseContent, ourContent, theirContent],
    path: path2
  });
  const oid = await _writeObject({
    fs,
    gitdir,
    type: "blob",
    object: Buffer2.from(mergedText, "utf8"),
    dryRun
  return { cleanMerge, mergeResult: { mode, path: path2, oid, type } };
async function _merge({
  fs,
  cache,
  dir,
  gitdir,
  ours,
  theirs,
  fastForward: fastForward2 = true,
  fastForwardOnly = false,
  dryRun = false,
  noUpdateBranch = false,
  abortOnConflict = true,
  message,
  author,
  committer,
  signingKey,
  onSign,
  mergeDriver
}) {
  if (ours === void 0) {
    ours = await _currentBranch({ fs, gitdir, fullname: true });
  }
  ours = await GitRefManager.expand({
    ref: ours
  });
  theirs = await GitRefManager.expand({
    fs,
    gitdir,
    ref: theirs
  });
  const ourOid = await GitRefManager.resolve({
    fs,
    gitdir,
    ref: ours
  });
  const theirOid = await GitRefManager.resolve({
    fs,
    gitdir,
    ref: theirs
  });
  const baseOids = await _findMergeBase({
    fs,
    cache,
    gitdir,
    oids: [ourOid, theirOid]
  });
  if (baseOids.length !== 1) {
    throw new MergeNotSupportedError();
  }
  const baseOid = baseOids[0];
  if (baseOid === theirOid) {
    return {
      oid: ourOid,
      alreadyMerged: true
    };
  }
  if (fastForward2 && baseOid === ourOid) {
    if (!dryRun && !noUpdateBranch) {
      await GitRefManager.writeRef({ fs, gitdir, ref: ours, value: theirOid });
    return {
      oid: theirOid,
      fastForward: true
    };
  } else {
    if (fastForwardOnly) {
      throw new FastForwardError();
    const tree = await mergeTree({
      cache,
      dir,
      ourOid,
      theirOid,
      baseOid,
      ourName: abbreviateRef(ours),
      baseName: "base",
      theirName: abbreviateRef(theirs),
      dryRun,
      abortOnConflict,
      mergeDriver
    });
    if (!message) {
      message = `Merge branch '${abbreviateRef(theirs)}' into ${abbreviateRef(ours)}`;
    }
    const oid = await _commit({
      fs,
      cache,
      gitdir,
      message,
      ref: ours,
      tree,
      parent: [ourOid, theirOid],
      author,
      committer,
      signingKey,
      onSign,
      dryRun,
      noUpdateBranch
    return {
      oid,
      tree,
      mergeCommit: true
    };
  }
async function _pull({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir,
  ref,
  url,
  remote,
  remoteRef,
  prune,
  pruneTags,
  fastForward: fastForward2,
  fastForwardOnly,
  corsProxy,
  singleBranch,
  headers,
  author,
  committer,
  signingKey
}) {
  try {
    if (!ref) {
      const head = await _currentBranch({ fs, gitdir });
      if (!head) {
        throw new MissingParameterError("ref");
      }
      ref = head;
    const { fetchHead, fetchHeadDescription } = await _fetch({
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      ref,
      url,
      remote,
      remoteRef,
      singleBranch,
      headers,
      prune,
      pruneTags
    await _merge({
      cache,
      ours: ref,
      theirs: fetchHead,
      fastForward: fastForward2,
      fastForwardOnly,
      message: `Merge ${fetchHeadDescription}`,
      author,
      committer,
      signingKey,
      dryRun: false,
      noUpdateBranch: false
    await _checkout({
      cache,
      onProgress,
      dir,
      ref,
      remote,
      noCheckout: false
  } catch (err) {
    err.caller = "git.pull";
    throw err;
  }
}
async function fastForward({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  url,
  remote,
  remoteRef,
  corsProxy,
  singleBranch,
  headers = {},
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("http", http);
    assertParameter("gitdir", gitdir);
    const thisWillNotBeUsed = {
      name: "",
      email: "",
      timestamp: Date.now(),
      timezoneOffset: 0
    };
    return await _pull({
      fs: new FileSystem(fs),
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      ref,
      url,
      remote,
      remoteRef,
      fastForwardOnly: true,
      corsProxy,
      singleBranch,
      headers,
      author: thisWillNotBeUsed,
      committer: thisWillNotBeUsed
  } catch (err) {
    err.caller = "git.fastForward";
    throw err;
  }
}
async function fetch({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  remote,
  remoteRef,
  url,
  corsProxy,
  depth = null,
  since = null,
  exclude = [],
  relative = false,
  tags = false,
  singleBranch = false,
  headers = {},
  prune = false,
  pruneTags = false,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("http", http);
    assertParameter("gitdir", gitdir);
    return await _fetch({
      fs: new FileSystem(fs),
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      ref,
      remote,
      remoteRef,
      url,
      corsProxy,
      depth,
      since,
      exclude,
      relative,
      tags,
      singleBranch,
      headers,
      prune,
      pruneTags
    });
  } catch (err) {
    err.caller = "git.fetch";
    throw err;
  }
}
async function findMergeBase({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oids,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oids", oids);
    return await _findMergeBase({
      fs: new FileSystem(fs),
      oids
  } catch (err) {
    err.caller = "git.findMergeBase";
    throw err;
  }
}
async function _findRoot({ fs, filepath }) {
  if (await fs.exists(join(filepath, ".git"))) {
    return filepath;
  } else {
    const parent = dirname(filepath);
    if (parent === filepath) {
      throw new NotFoundError(`git root for ${filepath}`);
    return _findRoot({ fs, filepath: parent });
  }
async function findRoot({ fs, filepath }) {
  try {
    assertParameter("fs", fs);
    assertParameter("filepath", filepath);
    return await _findRoot({ fs: new FileSystem(fs), filepath });
  } catch (err) {
    err.caller = "git.findRoot";
    throw err;
  }
async function getConfig({ fs, dir, gitdir = join(dir, ".git"), path: path2 }) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("path", path2);
    return await _getConfig({
      fs: new FileSystem(fs),
      gitdir,
      path: path2
    });
  } catch (err) {
    err.caller = "git.getConfig";
    throw err;
  }
async function _getConfigAll({ fs, gitdir, path: path2 }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  return config.getall(path2);
async function getConfigAll({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  path: path2
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("path", path2);
    return await _getConfigAll({
      fs: new FileSystem(fs),
      gitdir,
      path: path2
    });
  } catch (err) {
    err.caller = "git.getConfigAll";
    throw err;
  }
async function getRemoteInfo({
  http,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  corsProxy,
  url,
  headers = {},
  forPush = false
}) {
  try {
    assertParameter("http", http);
    assertParameter("url", url);
    const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
    const remote = await GitRemoteHTTP2.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: forPush ? "git-receive-pack" : "git-upload-pack",
      url,
      headers,
      protocolVersion: 1
    });
    const result = {
      capabilities: [...remote.capabilities]
    };
    for (const [ref, oid] of remote.refs) {
      const parts = ref.split("/");
      const last2 = parts.pop();
      let o = result;
      for (const part of parts) {
        o[part] = o[part] || {};
        o = o[part];
      o[last2] = oid;
    for (const [symref, ref] of remote.symrefs) {
      const parts = symref.split("/");
      const last2 = parts.pop();
      let o = result;
      for (const part of parts) {
        o[part] = o[part] || {};
        o = o[part];
      o[last2] = ref;
    return result;
  } catch (err) {
    err.caller = "git.getRemoteInfo";
    throw err;
  }
async function getRemoteInfo2({
  http,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  corsProxy,
  url,
  headers = {},
  forPush = false,
  protocolVersion = 2
}) {
  try {
    assertParameter("http", http);
    assertParameter("url", url);
    const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
    const remote = await GitRemoteHTTP2.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: forPush ? "git-receive-pack" : "git-upload-pack",
      url,
      headers,
      protocolVersion
    });
    if (remote.protocolVersion === 2) {
        protocolVersion: remote.protocolVersion,
        capabilities: remote.capabilities2
    const capabilities = {};
    for (const cap of remote.capabilities) {
      const [key2, value] = cap.split("=");
      if (value) {
        capabilities[key2] = value;
      } else {
        capabilities[key2] = true;
    return {
      protocolVersion: 1,
      capabilities,
      refs: formatInfoRefs(remote, void 0, true, true)
    };
  } catch (err) {
    err.caller = "git.getRemoteInfo2";
    throw err;
  }
async function hashObject({
  type,
  object,
  format = "content",
  oid = void 0
}) {
  if (format !== "deflated") {
    if (format !== "wrapped") {
      object = GitObject.wrap({ type, object });
    oid = await shasum(object);
  }
  return { oid, object };
async function hashBlob({ object }) {
  try {
    assertParameter("object", object);
    if (typeof object === "string") {
      object = Buffer2.from(object, "utf8");
    } else {
      object = Buffer2.from(object);
    const type = "blob";
    const { oid, object: _object } = await hashObject({
      type: "blob",
      format: "content",
      object
    });
    return { oid, type, object: new Uint8Array(_object), format: "wrapped" };
  } catch (err) {
    err.caller = "git.hashBlob";
    throw err;
  }
async function _indexPack({
  fs,
  cache,
  onProgress,
  dir,
  gitdir,
  filepath
}) {
  try {
    filepath = join(dir, filepath);
    const pack = await fs.read(filepath);
    const getExternalRefDelta = (oid) => _readObject({ fs, cache, gitdir, oid });
    const idx = await GitPackIndex.fromPack({
      pack,
      getExternalRefDelta,
      onProgress
    });
    await fs.write(filepath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
    return {
      oids: [...idx.hashes]
    };
  } catch (err) {
    err.caller = "git.indexPack";
    throw err;
  }
async function indexPack({
  fs,
  onProgress,
  dir,
  gitdir = join(dir, ".git"),
  filepath,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("dir", dir);
    assertParameter("gitdir", dir);
    assertParameter("filepath", filepath);
    return await _indexPack({
      fs: new FileSystem(fs),
      cache,
      onProgress,
      dir,
      gitdir,
      filepath
    });
  } catch (err) {
    err.caller = "git.indexPack";
    throw err;
  }
}
async function init({
  fs,
  bare = false,
  dir,
  gitdir = bare ? dir : join(dir, ".git"),
  defaultBranch = "master"
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    if (!bare) {
      assertParameter("dir", dir);
    return await _init({
      fs: new FileSystem(fs),
      bare,
      dir,
      gitdir,
      defaultBranch
    });
  } catch (err) {
    err.caller = "git.init";
    throw err;
  }
async function _isDescendent({
  fs,
  cache,
  gitdir,
  oid,
  ancestor,
  depth
}) {
  const shallows = await GitShallowManager.read({ fs, gitdir });
  if (!oid) {
    throw new MissingParameterError("oid");
  }
  if (!ancestor) {
    throw new MissingParameterError("ancestor");
  }
  if (oid === ancestor)
    return false;
  const queue = [oid];
  const visited = new Set();
  let searchdepth = 0;
  while (queue.length) {
    if (searchdepth++ === depth) {
      throw new MaxDepthError(depth);
    }
    const oid2 = queue.shift();
    const { type, object } = await _readObject({
      fs,
      cache,
      gitdir,
      oid: oid2
    });
    if (type !== "commit") {
      throw new ObjectTypeError(oid2, type, "commit");
    const commit2 = GitCommit.from(object).parse();
    for (const parent of commit2.parent) {
      if (parent === ancestor)
        return true;
    if (!shallows.has(oid2)) {
        if (!visited.has(parent)) {
          queue.push(parent);
          visited.add(parent);
  }
  return false;
async function isDescendent({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oid,
  ancestor,
  depth = -1,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    assertParameter("ancestor", ancestor);
    return await _isDescendent({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
      ancestor,
      depth
    });
  } catch (err) {
    err.caller = "git.isDescendent";
    throw err;
  }
async function isIgnored({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  filepath
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("dir", dir);
    assertParameter("gitdir", gitdir);
    assertParameter("filepath", filepath);
    return GitIgnoreManager.isIgnored({
      fs: new FileSystem(fs),
      dir,
      gitdir,
      filepath
    });
  } catch (err) {
    err.caller = "git.isIgnored";
    throw err;
  }
async function listBranches({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  remote
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    return GitRefManager.listBranches({
      fs: new FileSystem(fs),
      gitdir,
      remote
    });
  } catch (err) {
    err.caller = "git.listBranches";
    throw err;
  }
}
async function _listFiles({ fs, gitdir, ref, cache }) {
  if (ref) {
    const oid = await GitRefManager.resolve({ gitdir, fs, ref });
    const filenames = [];
    await accumulateFilesFromOid({
      fs,
      cache,
      gitdir,
      oid,
      filenames,
      prefix: ""
    });
    return filenames;
  } else {
    return GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      return index2.entries.map((x) => x.path);
    });
  }
async function accumulateFilesFromOid({
  fs,
  cache,
  gitdir,
  oid,
  filenames,
  prefix
}) {
  const { tree } = await _readTree({ fs, cache, gitdir, oid });
  for (const entry of tree) {
    if (entry.type === "tree") {
      await accumulateFilesFromOid({
        oid: entry.oid,
        prefix: join(prefix, entry.path)
      filenames.push(join(prefix, entry.path));
  }
}
async function listFiles({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    return await _listFiles({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      ref
    });
  } catch (err) {
    err.caller = "git.listFiles";
    throw err;
  }
async function _listNotes({ fs, cache, gitdir, ref }) {
  let parent;
  try {
    parent = await GitRefManager.resolve({ gitdir, fs, ref });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return [];
    }
  }
  const result = await _readTree({
    oid: parent
  const notes = result.tree.map((entry) => ({
    target: entry.path,
    note: entry.oid
  }));
  return notes;
async function listNotes({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  ref = "refs/notes/commits",
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    return await _listNotes({
      fs: new FileSystem(fs),
      ref
  } catch (err) {
    err.caller = "git.listNotes";
    throw err;
  }
async function _listRemotes({ fs, gitdir }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  const remoteNames = await config.getSubsections("remote");
  const remotes = Promise.all(remoteNames.map(async (remote) => {
    const url = await config.get(`remote.${remote}.url`);
    return { remote, url };
  }));
  return remotes;
async function listRemotes({ fs, dir, gitdir = join(dir, ".git") }) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    return await _listRemotes({
      fs: new FileSystem(fs),
      gitdir
    });
  } catch (err) {
    err.caller = "git.listRemotes";
    throw err;
  }
async function parseListRefsResponse(stream) {
  const read = GitPktLine.streamReader(stream);
  const refs = [];
  let line;
  while (true) {
    line = await read();
    if (line === true)
      break;
    if (line === null)
      continue;
    line = line.toString("utf8").replace(/\n$/, "");
    const [oid, ref, ...attrs] = line.split(" ");
    const r = { ref, oid };
    for (const attr2 of attrs) {
      const [name, value] = attr2.split(":");
      if (name === "symref-target") {
        r.target = value;
      } else if (name === "peeled") {
        r.peeled = value;
    refs.push(r);
  }
  return refs;
async function writeListRefsRequest({ prefix, symrefs, peelTags }) {
  const packstream = [];
  packstream.push(GitPktLine.encode("command=ls-refs\n"));
  packstream.push(GitPktLine.encode(`agent=${pkg.agent}
  if (peelTags || symrefs || prefix) {
    packstream.push(GitPktLine.delim());
  }
  if (peelTags)
    packstream.push(GitPktLine.encode("peel"));
  if (symrefs)
    packstream.push(GitPktLine.encode("symrefs"));
  if (prefix)
    packstream.push(GitPktLine.encode(`ref-prefix ${prefix}`));
  packstream.push(GitPktLine.flush());
  return packstream;
async function listServerRefs({
  http,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  corsProxy,
  url,
  headers = {},
  forPush = false,
  protocolVersion = 2,
  prefix,
  symrefs,
  peelTags
}) {
  try {
    assertParameter("http", http);
    assertParameter("url", url);
    const remote = await GitRemoteHTTP.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: forPush ? "git-receive-pack" : "git-upload-pack",
      url,
      headers,
      protocolVersion
    });
    if (remote.protocolVersion === 1) {
      return formatInfoRefs(remote, prefix, symrefs, peelTags);
    const body = await writeListRefsRequest({ prefix, symrefs, peelTags });
    const res = await GitRemoteHTTP.connect({
      http,
      auth: remote.auth,
      headers,
      corsProxy,
      service: forPush ? "git-receive-pack" : "git-upload-pack",
      url,
      body
    });
    return parseListRefsResponse(res.body);
  } catch (err) {
    err.caller = "git.listServerRefs";
    throw err;
  }
async function listTags({ fs, dir, gitdir = join(dir, ".git") }) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    return GitRefManager.listTags({ fs: new FileSystem(fs), gitdir });
  } catch (err) {
    err.caller = "git.listTags";
    throw err;
  }
async function resolveCommit({ fs, cache, gitdir, oid }) {
  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
  if (type === "tag") {
    oid = GitAnnotatedTag.from(object).parse().object;
    return resolveCommit({ fs, cache, gitdir, oid });
  }
  if (type !== "commit") {
    throw new ObjectTypeError(oid, type, "commit");
  }
  return { commit: GitCommit.from(object), oid };
async function _readCommit({ fs, cache, gitdir, oid }) {
  const { commit: commit2, oid: commitOid } = await resolveCommit({
    fs,
    cache,
    gitdir,
    oid
  const result = {
    oid: commitOid,
    commit: commit2.parse(),
    payload: commit2.withoutSignature()
  };
  return result;
async function resolveFileIdInTree({ fs, cache, gitdir, oid, fileId }) {
  if (fileId === EMPTY_OID)
    return;
  const _oid = oid;
  let filepath;
  const result = await resolveTree({ fs, cache, gitdir, oid });
  const tree = result.tree;
  if (fileId === result.oid) {
    filepath = result.path;
  } else {
    filepath = await _resolveFileId({
      fs,
      cache,
      gitdir,
      tree,
      fileId,
      oid: _oid
    });
    if (Array.isArray(filepath)) {
      if (filepath.length === 0)
        filepath = void 0;
      else if (filepath.length === 1)
        filepath = filepath[0];
    }
  }
  return filepath;
}
async function _resolveFileId({
  fs,
  cache,
  gitdir,
  tree,
  fileId,
  oid,
  filepaths = [],
  parentPath = ""
}) {
  const walks = tree.entries().map(function(entry) {
    let result;
    if (entry.oid === fileId) {
      result = join(parentPath, entry.path);
      filepaths.push(result);
    } else if (entry.type === "tree") {
      result = _readObject({
        oid: entry.oid
      }).then(function({ object }) {
        return _resolveFileId({
          fs,
          cache,
          gitdir,
          tree: GitTree.from(object),
          fileId,
          oid,
          filepaths,
          parentPath: join(parentPath, entry.path)
        });
    return result;
  await Promise.all(walks);
  return filepaths;
async function _log({
  fs,
  cache,
  gitdir,
  filepath,
  ref,
  depth,
  since,
  force,
  follow
}) {
  const sinceTimestamp = typeof since === "undefined" ? void 0 : Math.floor(since.valueOf() / 1e3);
  const commits = [];
  const shallowCommits = await GitShallowManager.read({ fs, gitdir });
  const oid = await GitRefManager.resolve({ fs, gitdir, ref });
  const tips = [await _readCommit({ fs, cache, gitdir, oid })];
  let lastFileOid;
  let lastCommit;
  let isOk;
  function endCommit(commit2) {
    if (isOk && filepath)
      commits.push(commit2);
  }
  while (tips.length > 0) {
    const commit2 = tips.pop();
    if (sinceTimestamp !== void 0 && commit2.commit.committer.timestamp <= sinceTimestamp) {
      break;
    }
    if (filepath) {
      let vFileOid;
      try {
        vFileOid = await resolveFilepath({
          oid: commit2.commit.tree,
          filepath
        if (lastCommit && lastFileOid !== vFileOid) {
          commits.push(lastCommit);
        }
        lastFileOid = vFileOid;
        lastCommit = commit2;
        isOk = true;
      } catch (e) {
        if (e instanceof NotFoundError) {
          let found = follow && lastFileOid;
          if (found) {
            found = await resolveFileIdInTree({
              fs,
              cache,
              gitdir,
              oid: commit2.commit.tree,
              fileId: lastFileOid
            });
              if (Array.isArray(found)) {
                if (lastCommit) {
                  const lastFound = await resolveFileIdInTree({
                    fs,
                    cache,
                    gitdir,
                    oid: lastCommit.commit.tree,
                    fileId: lastFileOid
                  });
                  if (Array.isArray(lastFound)) {
                    found = found.filter((p) => lastFound.indexOf(p) === -1);
                    if (found.length === 1) {
                      found = found[0];
                      filepath = found;
                      if (lastCommit)
                        commits.push(lastCommit);
                    } else {
                      found = false;
                      if (lastCommit)
                        commits.push(lastCommit);
                      break;
              } else {
                filepath = found;
                if (lastCommit)
                  commits.push(lastCommit);
          }
          if (!found) {
            if (isOk && lastFileOid) {
              commits.push(lastCommit);
              if (!force)
                break;
            if (!force && !follow)
              throw e;
          lastCommit = commit2;
          isOk = false;
        } else
          throw e;
    } else {
      commits.push(commit2);
    if (depth !== void 0 && commits.length === depth) {
      endCommit(commit2);
      break;
    if (!shallowCommits.has(commit2.oid)) {
      for (const oid2 of commit2.commit.parent) {
        const commit3 = await _readCommit({ fs, cache, gitdir, oid: oid2 });
        if (!tips.map((commit4) => commit4.oid).includes(commit3.oid)) {
          tips.push(commit3);
        }
    if (tips.length === 0) {
      endCommit(commit2);
    tips.sort((a, b) => compareAge(a.commit, b.commit));
  }
  return commits;
async function log({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  filepath,
  ref = "HEAD",
  depth,
  since,
  force,
  follow,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    return await _log({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      filepath,
      ref,
      depth,
      since,
      force,
      follow
    });
  } catch (err) {
    err.caller = "git.log";
    throw err;
  }
async function merge({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, ".git"),
  ours,
  theirs,
  fastForward: fastForward2 = true,
  fastForwardOnly = false,
  dryRun = false,
  noUpdateBranch = false,
  abortOnConflict = true,
  message,
  author: _author,
  committer: _committer,
  signingKey,
  cache = {},
  mergeDriver
}) {
  try {
    assertParameter("fs", _fs);
    if (signingKey) {
      assertParameter("onSign", onSign);
    const fs = new FileSystem(_fs);
    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author && (!fastForwardOnly || !fastForward2)) {
      throw new MissingNameError("author");
    }
    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer
    });
    if (!committer && (!fastForwardOnly || !fastForward2)) {
      throw new MissingNameError("committer");
    }
    return await _merge({
      fs,
      cache,
      dir,
      gitdir,
      ours,
      theirs,
      fastForward: fastForward2,
      fastForwardOnly,
      dryRun,
      noUpdateBranch,
      abortOnConflict,
      message,
      author,
      committer,
      signingKey,
      onSign,
      mergeDriver
    });
  } catch (err) {
    err.caller = "git.merge";
    throw err;
  }
var types = {
  commit: 16,
  tree: 32,
  blob: 48,
  tag: 64,
  ofs_delta: 96,
  ref_delta: 112
};
async function _pack({
  fs,
  cache,
  dir,
  gitdir = join(dir, ".git"),
  oids
}) {
  const hash2 = new import_sha1.default();
  const outputStream = [];
  function write(chunk, enc) {
    const buff = Buffer2.from(chunk, enc);
    outputStream.push(buff);
    hash2.update(buff);
  }
  async function writeObject2({ stype, object }) {
    const type = types[stype];
    let length = object.length;
    let multibyte = length > 15 ? 128 : 0;
    const lastFour = length & 15;
    length = length >>> 4;
    let byte = (multibyte | type | lastFour).toString(16);
    write(byte, "hex");
    while (multibyte) {
      multibyte = length > 127 ? 128 : 0;
      byte = multibyte | length & 127;
      write(padHex(2, byte), "hex");
      length = length >>> 7;
    }
    write(Buffer2.from(await deflate(object)));
  }
  write("PACK");
  write("00000002", "hex");
  write(padHex(8, oids.length), "hex");
  for (const oid of oids) {
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    await writeObject2({ write, object, stype: type });
  }
  const digest = hash2.digest();
  outputStream.push(digest);
  return outputStream;
}
async function _packObjects({ fs, cache, gitdir, oids, write }) {
  const buffers = await _pack({ fs, cache, gitdir, oids });
  const packfile = Buffer2.from(await collect(buffers));
  const packfileSha = packfile.slice(-20).toString("hex");
  const filename = `pack-${packfileSha}.pack`;
  if (write) {
    await fs.write(join(gitdir, `objects/pack/${filename}`), packfile);
    return { filename };
  }
  return {
    filename,
    packfile: new Uint8Array(packfile)
  };
}
async function packObjects({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oids,
  write = false,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oids", oids);
    return await _packObjects({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oids,
      write
    });
  } catch (err) {
    err.caller = "git.packObjects";
    throw err;
  }
}
async function pull({
  fs: _fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  url,
  remote,
  remoteRef,
  prune = false,
  pruneTags = false,
  fastForward: fastForward2 = true,
  fastForwardOnly = false,
  corsProxy,
  singleBranch,
  headers = {},
  author: _author,
  committer: _committer,
  signingKey,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    const fs = new FileSystem(_fs);
    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author)
      throw new MissingNameError("author");
    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer
    });
    if (!committer)
      throw new MissingNameError("committer");
    return await _pull({
      fs,
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir,
      ref,
      url,
      remote,
      remoteRef,
      fastForward: fastForward2,
      fastForwardOnly,
      corsProxy,
      singleBranch,
      headers,
      author,
      committer,
      signingKey,
      prune,
      pruneTags
    });
  } catch (err) {
    err.caller = "git.pull";
    throw err;
  }
}
async function listCommitsAndTags({
  fs,
  cache,
  dir,
  gitdir = join(dir, ".git"),
  start,
  finish
}) {
  const shallows = await GitShallowManager.read({ fs, gitdir });
  const startingSet = new Set();
  const finishingSet = new Set();
  for (const ref of start) {
    startingSet.add(await GitRefManager.resolve({ fs, gitdir, ref }));
  }
  for (const ref of finish) {
      const oid = await GitRefManager.resolve({ fs, gitdir, ref });
      finishingSet.add(oid);
  }
  const visited = new Set();
  async function walk2(oid) {
    visited.add(oid);
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type === "tag") {
      const tag2 = GitAnnotatedTag.from(object);
      const commit2 = tag2.headers().object;
      return walk2(commit2);
    if (type !== "commit") {
      throw new ObjectTypeError(oid, type, "commit");
    if (!shallows.has(oid)) {
      const commit2 = GitCommit.from(object);
      const parents = commit2.headers().parent;
      for (oid of parents) {
        if (!finishingSet.has(oid) && !visited.has(oid)) {
          await walk2(oid);
      }
  }
  for (const oid of startingSet) {
    await walk2(oid);
  }
  return visited;
async function listObjects({
  fs,
  cache,
  dir,
  gitdir = join(dir, ".git"),
  oids
}) {
  const visited = new Set();
  async function walk2(oid) {
    if (visited.has(oid))
      return;
    visited.add(oid);
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type === "tag") {
      const tag2 = GitAnnotatedTag.from(object);
      const obj = tag2.headers().object;
      await walk2(obj);
    } else if (type === "commit") {
      const commit2 = GitCommit.from(object);
      const tree = commit2.headers().tree;
      await walk2(tree);
    } else if (type === "tree") {
      const tree = GitTree.from(object);
      for (const entry of tree) {
        if (entry.type === "blob") {
          visited.add(entry.oid);
        if (entry.type === "tree") {
          await walk2(entry.oid);
        }
      }
  }
  for (const oid of oids) {
    await walk2(oid);
  }
  return visited;
async function parseReceivePackResponse(packfile) {
  const result = {};
  let response = "";
  const read = GitPktLine.streamReader(packfile);
  let line = await read();
  while (line !== true) {
    if (line !== null)
      response += line.toString("utf8") + "\n";
    line = await read();
  }
  const lines = response.toString("utf8").split("\n");
  line = lines.shift();
  if (!line.startsWith("unpack ")) {
    throw new ParseError('unpack ok" or "unpack [error message]', line);
  }
  result.ok = line === "unpack ok";
  if (!result.ok) {
    result.error = line.slice("unpack ".length);
  }
  result.refs = {};
  for (const line2 of lines) {
    if (line2.trim() === "")
      continue;
    const status2 = line2.slice(0, 2);
    const refAndMessage = line2.slice(3);
    let space2 = refAndMessage.indexOf(" ");
    if (space2 === -1)
      space2 = refAndMessage.length;
    const ref = refAndMessage.slice(0, space2);
    const error = refAndMessage.slice(space2 + 1);
    result.refs[ref] = {
      ok: status2 === "ok",
      error
    };
  }
  return result;
async function writeReceivePackRequest({
  capabilities = [],
  triplets = []
}) {
  const packstream = [];
  let capsFirstLine = `\0 ${capabilities.join(" ")}`;
  for (const trip of triplets) {
    packstream.push(GitPktLine.encode(`${trip.oldoid} ${trip.oid} ${trip.fullRef}${capsFirstLine}
    capsFirstLine = "";
  }
  packstream.push(GitPktLine.flush());
  return packstream;
async function _push({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  gitdir,
  ref: _ref,
  remoteRef: _remoteRef,
  remote,
  url: _url,
  force = false,
  delete: _delete = false,
  corsProxy,
  headers = {}
}) {
  const ref = _ref || await _currentBranch({ fs, gitdir });
  if (typeof ref === "undefined") {
    throw new MissingParameterError("ref");
  }
  const config = await GitConfigManager.get({ fs, gitdir });
  remote = remote || await config.get(`branch.${ref}.pushRemote`) || await config.get("remote.pushDefault") || await config.get(`branch.${ref}.remote`) || "origin";
  const url = _url || await config.get(`remote.${remote}.pushurl`) || await config.get(`remote.${remote}.url`);
  if (typeof url === "undefined") {
    throw new MissingParameterError("remote OR url");
  }
  const remoteRef = _remoteRef || await config.get(`branch.${ref}.merge`);
  if (typeof url === "undefined") {
    throw new MissingParameterError("remoteRef");
  }
  if (corsProxy === void 0) {
    corsProxy = await config.get("http.corsProxy");
  }
  const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
  const oid = _delete ? "0000000000000000000000000000000000000000" : await GitRefManager.resolve({ fs, gitdir, ref: fullRef });
  const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
  const httpRemote = await GitRemoteHTTP2.discover({
    service: "git-receive-pack",
    url,
    headers,
    protocolVersion: 1
  });
  const auth = httpRemote.auth;
  let fullRemoteRef;
  if (!remoteRef) {
    fullRemoteRef = fullRef;
  } else {
    try {
      fullRemoteRef = await GitRefManager.expandAgainstMap({
        ref: remoteRef,
        map: httpRemote.refs
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        fullRemoteRef = remoteRef.startsWith("refs/") ? remoteRef : `refs/heads/${remoteRef}`;
      } else {
        throw err;
      }
  }
  const oldoid = httpRemote.refs.get(fullRemoteRef) || "0000000000000000000000000000000000000000";
  const thinPack = !httpRemote.capabilities.has("no-thin");
  let objects = new Set();
  if (!_delete) {
    const finish = [...httpRemote.refs.values()];
    let skipObjects = new Set();
    if (oldoid !== "0000000000000000000000000000000000000000") {
      const mergebase = await _findMergeBase({
        fs,
        cache,
        gitdir,
        oids: [oid, oldoid]
      });
      for (const oid2 of mergebase)
        finish.push(oid2);
      if (thinPack) {
        skipObjects = await listObjects({ fs, cache, gitdir, oids: mergebase });
      }
    if (!finish.includes(oid)) {
      const commits = await listCommitsAndTags({
        fs,
        cache,
        gitdir,
        start: [oid],
        finish
      });
      objects = await listObjects({ fs, cache, gitdir, oids: commits });
    if (thinPack) {
        const ref2 = await GitRefManager.resolve({
          ref: `refs/remotes/${remote}/HEAD`,
          depth: 2
        });
        const { oid: oid2 } = await GitRefManager.resolveAgainstMap({
          ref: ref2.replace(`refs/remotes/${remote}/`, ""),
          fullref: ref2,
          map: httpRemote.refs
        const oids = [oid2];
        for (const oid3 of await listObjects({ fs, cache, gitdir, oids })) {
          skipObjects.add(oid3);
      } catch (e) {
      for (const oid2 of skipObjects) {
        objects.delete(oid2);
    if (oid === oldoid)
      force = true;
    if (!force) {
      if (fullRef.startsWith("refs/tags") && oldoid !== "0000000000000000000000000000000000000000") {
        throw new PushRejectedError("tag-exists");
      }
      if (oid !== "0000000000000000000000000000000000000000" && oldoid !== "0000000000000000000000000000000000000000" && !await _isDescendent({
        fs,
        cache,
        gitdir,
        oid,
        ancestor: oldoid,
        depth: -1
      })) {
        throw new PushRejectedError("not-fast-forward");
  }
  const capabilities = filterCapabilities([...httpRemote.capabilities], ["report-status", "side-band-64k", `agent=${pkg.agent}`]);
  const packstream1 = await writeReceivePackRequest({
    capabilities,
    triplets: [{ oldoid, oid, fullRef: fullRemoteRef }]
  const packstream2 = _delete ? [] : await _pack({
    cache,
    gitdir,
    oids: [...objects]
  });
  const res = await GitRemoteHTTP2.connect({
    service: "git-receive-pack",
    url,
    auth,
    headers,
    body: [...packstream1, ...packstream2]
  const { packfile, progress } = await GitSideBand.demux(res.body);
  if (onMessage) {
    const lines = splitLines(progress);
    forAwait(lines, async (line) => {
      await onMessage(line);
    });
  }
  const result = await parseReceivePackResponse(packfile);
  if (res.headers) {
    result.headers = res.headers;
  }
  if (remote && result.ok && result.refs[fullRemoteRef].ok) {
    const ref2 = `refs/remotes/${remote}/${fullRemoteRef.replace("refs/heads", "")}`;
    if (_delete) {
      await GitRefManager.deleteRef({ fs, gitdir, ref: ref2 });
    } else {
      await GitRefManager.writeRef({ fs, gitdir, ref: ref2, value: oid });
  }
  if (result.ok && Object.values(result.refs).every((result2) => result2.ok)) {
    return result;
  } else {
    const prettyDetails = Object.entries(result.refs).filter(([k, v]) => !v.ok).map(([k, v]) => `
  - ${k}: ${v.error}`).join("");
    throw new GitPushError(prettyDetails, result);
  }
async function push({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  remoteRef,
  remote = "origin",
  url,
  force = false,
  delete: _delete = false,
  corsProxy,
  headers = {},
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("http", http);
    assertParameter("gitdir", gitdir);
    return await _push({
      fs: new FileSystem(fs),
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      ref,
      remoteRef,
      remote,
      url,
      force,
      delete: _delete,
      corsProxy,
      headers
  } catch (err) {
    err.caller = "git.push";
    throw err;
  }
async function resolveBlob({ fs, cache, gitdir, oid }) {
  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
  if (type === "tag") {
    oid = GitAnnotatedTag.from(object).parse().object;
    return resolveBlob({ fs, cache, gitdir, oid });
  }
  if (type !== "blob") {
    throw new ObjectTypeError(oid, type, "blob");
  }
  return { oid, blob: new Uint8Array(object) };
async function _readBlob({
  fs,
  cache,
  gitdir,
  oid,
  filepath = void 0
}) {
  if (filepath !== void 0) {
    oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
  }
  const blob = await resolveBlob({
  });
  return blob;
}
async function readBlob({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oid,
  filepath,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    return await _readBlob({
      fs: new FileSystem(fs),
      oid,
      filepath
  } catch (err) {
    err.caller = "git.readBlob";
    throw err;
  }
}
async function readCommit({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oid,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    return await _readCommit({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid
    });
  } catch (err) {
    err.caller = "git.readCommit";
    throw err;
  }
async function _readNote({
  fs,
  cache,
  gitdir,
  ref = "refs/notes/commits",
  oid
}) {
  const parent = await GitRefManager.resolve({ gitdir, fs, ref });
  const { blob } = await _readBlob({
    cache,
    gitdir,
    oid: parent,
    filepath: oid
  return blob;
async function readNote({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  ref = "refs/notes/commits",
  oid,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    assertParameter("oid", oid);
    return await _readNote({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      ref,
      oid
    });
  } catch (err) {
    err.caller = "git.readNote";
    throw err;
  }
}
async function readObject({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  oid,
  format = "parsed",
  filepath = void 0,
  encoding = void 0,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    const fs = new FileSystem(_fs);
    if (filepath !== void 0) {
      oid = await resolveFilepath({
        filepath
    const _format = format === "parsed" ? "content" : format;
    const result = await _readObject({
      format: _format
    });
    result.oid = oid;
    if (format === "parsed") {
      result.format = "parsed";
      switch (result.type) {
        case "commit":
          result.object = GitCommit.from(result.object).parse();
          break;
        case "tree":
          result.object = GitTree.from(result.object).entries();
          break;
        case "blob":
          if (encoding) {
            result.object = result.object.toString(encoding);
          } else {
            result.object = new Uint8Array(result.object);
            result.format = "content";
          }
          break;
        case "tag":
          result.object = GitAnnotatedTag.from(result.object).parse();
          break;
        default:
          throw new ObjectTypeError(result.oid, result.type, "blob|commit|tag|tree");
      }
    } else if (result.format === "deflated" || result.format === "wrapped") {
      result.type = result.format;
  } catch (err) {
    err.caller = "git.readObject";
    throw err;
  }
async function _readTag({ fs, cache, gitdir, oid }) {
  const { type, object } = await _readObject({
    cache,
    gitdir,
    format: "content"
  if (type !== "tag") {
    throw new ObjectTypeError(oid, type, "tag");
  }
  const tag2 = GitAnnotatedTag.from(object);
  const result = {
    tag: tag2.parse(),
    payload: tag2.payload()
  };
  return result;
async function readTag({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oid,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    return await _readTag({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid
    });
  } catch (err) {
    err.caller = "git.readTag";
    throw err;
  }
}
async function readTree({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  oid,
  filepath = void 0,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    return await _readTree({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
      filepath
    });
  } catch (err) {
    err.caller = "git.readTree";
    throw err;
  }
}
async function remove({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  filepath,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("filepath", filepath);
    await GitIndexManager.acquire({ fs: new FileSystem(_fs), gitdir, cache }, async function(index2) {
      index2.delete({ filepath });
    });
  } catch (err) {
    err.caller = "git.remove";
    throw err;
  }
}
async function _removeNote({
  fs,
  cache,
  onSign,
  gitdir,
  ref = "refs/notes/commits",
  oid,
  author,
  committer,
  signingKey
}) {
  let parent;
  try {
    parent = await GitRefManager.resolve({ gitdir, fs, ref });
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
  }
  const result = await _readTree({
    fs,
    gitdir,
    oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
  let tree = result.tree;
  tree = tree.filter((entry) => entry.path !== oid);
  const treeOid = await _writeTree({
    fs,
    gitdir,
    tree
  });
  const commitOid = await _commit({
    ref,
    tree: treeOid,
    parent: parent && [parent],
    message: `Note removed by 'isomorphic-git removeNote'
`,
  });
  return commitOid;
}
async function removeNote({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, ".git"),
  ref = "refs/notes/commits",
  oid,
  author: _author,
  committer: _committer,
  signingKey,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("oid", oid);
    const fs = new FileSystem(_fs);
    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author)
      throw new MissingNameError("author");
    const committer = await normalizeCommitterObject({
      author,
      committer: _committer
    if (!committer)
      throw new MissingNameError("committer");
    return await _removeNote({
      oid,
  } catch (err) {
    err.caller = "git.removeNote";
    throw err;
  }
async function _renameBranch({
  fs,
  gitdir,
  oldref,
  ref,
  checkout: checkout2 = false
}) {
  if (ref !== import_clean_git_ref.default.clean(ref)) {
    throw new InvalidRefNameError(ref, import_clean_git_ref.default.clean(ref));
  }
  if (oldref !== import_clean_git_ref.default.clean(oldref)) {
    throw new InvalidRefNameError(oldref, import_clean_git_ref.default.clean(oldref));
  }
  const fulloldref = `refs/heads/${oldref}`;
  const fullnewref = `refs/heads/${ref}`;
  const newexist = await GitRefManager.exists({ fs, gitdir, ref: fullnewref });
  if (newexist) {
    throw new AlreadyExistsError("branch", ref, false);
  }
  const value = await GitRefManager.resolve({
    ref: fulloldref,
    depth: 1
  });
  await GitRefManager.writeRef({ fs, gitdir, ref: fullnewref, value });
  await GitRefManager.deleteRef({ fs, gitdir, ref: fulloldref });
  if (checkout2) {
    await GitRefManager.writeSymbolicRef({
      ref: "HEAD",
      value: fullnewref
  }
async function renameBranch({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  oldref,
  checkout: checkout2 = false
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    assertParameter("oldref", oldref);
    return await _renameBranch({
      fs: new FileSystem(fs),
      gitdir,
      ref,
      oldref,
      checkout: checkout2
    });
  } catch (err) {
    err.caller = "git.renameBranch";
    throw err;
  }
async function hashObject$1({ gitdir, type, object }) {
  return shasum(GitObject.wrap({ type, object }));
async function resetIndex({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  filepath,
  ref,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("filepath", filepath);
    const fs = new FileSystem(_fs);
    let oid;
    let workdirOid;
      oid = await GitRefManager.resolve({ fs, gitdir, ref: ref || "HEAD" });
    } catch (e) {
      if (ref) {
        throw e;
      }
    }
    if (oid) {
        oid = await resolveFilepath({
          fs,
          cache,
          gitdir,
          oid,
          filepath
        });
        oid = null;
      }
    }
    let stats = {
      ctime: new Date(0),
      mtime: new Date(0),
      dev: 0,
      ino: 0,
      mode: 0,
      uid: 0,
      gid: 0,
      size: 0
    };
    const object = dir && await fs.read(join(dir, filepath));
    if (object) {
      workdirOid = await hashObject$1({
        gitdir,
        type: "blob",
        object
      });
      if (oid === workdirOid) {
        stats = await fs.lstat(join(dir, filepath));
    }
    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      index2.delete({ filepath });
        index2.insert({ filepath, stats, oid });
    });
  } catch (err) {
    err.caller = "git.reset";
    throw err;
  }
}
async function resolveRef({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  depth
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    const oid = await GitRefManager.resolve({
      fs: new FileSystem(fs),
      gitdir,
      ref,
      depth
    });
    return oid;
  } catch (err) {
    err.caller = "git.resolveRef";
    throw err;
  }
}
async function setConfig({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  path: path2,
  value,
  append: append3 = false
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("path", path2);
    const fs = new FileSystem(_fs);
    const config = await GitConfigManager.get({ fs, gitdir });
    if (append3) {
      await config.append(path2, value);
    } else {
      await config.set(path2, value);
    }
    await GitConfigManager.save({ fs, gitdir, config });
  } catch (err) {
    err.caller = "git.setConfig";
    throw err;
  }
}
async function status({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  filepath,
  cache = {}
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("filepath", filepath);
    const fs = new FileSystem(_fs);
    const ignored = await GitIgnoreManager.isIgnored({
      fs,
      gitdir,
      dir,
      filepath
    });
    if (ignored) {
      return "ignored";
    }
    const headTree = await getHeadTree({ fs, cache, gitdir });
    const treeOid = await getOidAtPath({
      fs,
      cache,
      gitdir,
      tree: headTree,
      path: filepath
    });
    const indexEntry = await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      for (const entry of index2) {
        if (entry.path === filepath)
          return entry;
      }
      return null;
    });
    const stats = await fs.lstat(join(dir, filepath));
    const H = treeOid !== null;
    const I = indexEntry !== null;
    const W = stats !== null;
    const getWorkdirOid = async () => {
      if (I && !compareStats(indexEntry, stats)) {
        return indexEntry.oid;
      } else {
        const object = await fs.read(join(dir, filepath));
        const workdirOid = await hashObject$1({
        if (I && indexEntry.oid === workdirOid) {
          if (stats.size !== -1) {
            GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
              index2.insert({ filepath, stats, oid: workdirOid });
            });
          }
        return workdirOid;
    };
    if (!H && !W && !I)
      return "absent";
    if (!H && !W && I)
      return "*absent";
    if (!H && W && !I)
      return "*added";
    if (!H && W && I) {
      const workdirOid = await getWorkdirOid();
      return workdirOid === indexEntry.oid ? "added" : "*added";
    if (H && !W && !I)
      return "deleted";
    if (H && !W && I) {
      return treeOid === indexEntry.oid ? "*deleted" : "*deleted";
    }
    if (H && W && !I) {
      const workdirOid = await getWorkdirOid();
      return workdirOid === treeOid ? "*undeleted" : "*undeletemodified";
    }
    if (H && W && I) {
      const workdirOid = await getWorkdirOid();
      if (workdirOid === treeOid) {
        return workdirOid === indexEntry.oid ? "unmodified" : "*unmodified";
      } else {
        return workdirOid === indexEntry.oid ? "modified" : "*modified";
      }
    }
  } catch (err) {
    err.caller = "git.status";
    throw err;
  }
async function getOidAtPath({ fs, cache, gitdir, tree, path: path2 }) {
  if (typeof path2 === "string")
    path2 = path2.split("/");
  const dirname2 = path2.shift();
  for (const entry of tree) {
    if (entry.path === dirname2) {
      if (path2.length === 0) {
        return entry.oid;
      }
      const { type, object } = await _readObject({
        fs,
        cache,
        oid: entry.oid
      if (type === "tree") {
        const tree2 = GitTree.from(object);
        return getOidAtPath({ fs, cache, gitdir, tree: tree2, path: path2 });
      }
      if (type === "blob") {
        throw new ObjectTypeError(entry.oid, type, "blob", path2.join("/"));
  }
  return null;
async function getHeadTree({ fs, cache, gitdir }) {
  let oid;
  try {
    oid = await GitRefManager.resolve({ fs, gitdir, ref: "HEAD" });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return [];
    }
  }
  const { tree } = await _readTree({ fs, cache, gitdir, oid });
  return tree;
}
async function statusMatrix({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  ref = "HEAD",
  filepaths = ["."],
  filter,
  cache = {},
  ignored: shouldIgnore = false
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    const fs = new FileSystem(_fs);
    return await _walk({
      fs,
      cache,
      dir,
      gitdir,
      trees: [TREE({ ref }), WORKDIR(), STAGE()],
      map: async function(filepath, [head, workdir, stage]) {
        if (!head && !stage && workdir) {
          if (!shouldIgnore) {
            const isIgnored2 = await GitIgnoreManager.isIgnored({
              fs,
              dir,
              filepath
            });
            if (isIgnored2) {
              return null;
        if (!filepaths.some((base) => worthWalking(filepath, base))) {
          return null;
        if (filter) {
          if (!filter(filepath))
            return;
        const [headType, workdirType, stageType] = await Promise.all([
          head && head.type(),
          workdir && workdir.type(),
          stage && stage.type()
        ]);
        const isBlob = [headType, workdirType, stageType].includes("blob");
        if ((headType === "tree" || headType === "special") && !isBlob)
          return;
        if (headType === "commit")
          return null;
        if ((workdirType === "tree" || workdirType === "special") && !isBlob)
          return;
        if (stageType === "commit")
          return null;
        if ((stageType === "tree" || stageType === "special") && !isBlob)
          return;
        const headOid = headType === "blob" ? await head.oid() : void 0;
        const stageOid = stageType === "blob" ? await stage.oid() : void 0;
        let workdirOid;
        if (headType !== "blob" && workdirType === "blob" && stageType !== "blob") {
          workdirOid = "42";
        } else if (workdirType === "blob") {
          workdirOid = await workdir.oid();
        const entry = [void 0, headOid, workdirOid, stageOid];
        const result = entry.map((value) => entry.indexOf(value));
        result.shift();
        return [filepath, ...result];
    });
  } catch (err) {
    err.caller = "git.statusMatrix";
    throw err;
  }
async function tag({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  object,
  force = false
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    const fs = new FileSystem(_fs);
    if (ref === void 0) {
      throw new MissingParameterError("ref");
    ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
    const value = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: object || "HEAD"
    });
    if (!force && await GitRefManager.exists({ fs, gitdir, ref })) {
      throw new AlreadyExistsError("tag", ref);
    }
    await GitRefManager.writeRef({ fs, gitdir, ref, value });
  } catch (err) {
    err.caller = "git.tag";
    throw err;
  }
async function updateIndex({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  cache = {},
  filepath,
  oid,
  mode,
  add: add2,
  remove: remove3,
  force
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("filepath", filepath);
    const fs = new FileSystem(_fs);
    if (remove3) {
      return await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
        let fileStats2;
        if (!force) {
          fileStats2 = await fs.lstat(join(dir, filepath));
          if (fileStats2) {
            if (fileStats2.isDirectory()) {
              throw new InvalidFilepathError("directory");
            return;
          }
        }
        if (index2.has({ filepath })) {
          index2.delete({
            filepath
    let fileStats;
    if (!oid) {
      fileStats = await fs.lstat(join(dir, filepath));
      if (!fileStats) {
        throw new NotFoundError(`file at "${filepath}" on disk and "remove" not set`);
      if (fileStats.isDirectory()) {
        throw new InvalidFilepathError("directory");
    return await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
      if (!add2 && !index2.has({ filepath })) {
        throw new NotFoundError(`file at "${filepath}" in index and "add" not set`);
      let stats = {
        ctime: new Date(0),
        mtime: new Date(0),
        dev: 0,
        ino: 0,
        mode,
        uid: 0,
        gid: 0,
        size: 0
      };
        stats = fileStats;
        const object = stats.isSymbolicLink() ? await fs.readlink(join(dir, filepath)) : await fs.read(join(dir, filepath));
        oid = await _writeObject({
          fs,
          gitdir,
          type: "blob",
          format: "content",
          object
      }
      index2.insert({
        filepath,
        oid,
        stats
      return oid;
    });
  } catch (err) {
    err.caller = "git.updateIndex";
    throw err;
  }
async function walk({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  trees,
  map,
  reduce,
  iterate,
  cache = {}
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("trees", trees);
    return await _walk({
      fs: new FileSystem(fs),
      cache,
      dir,
      gitdir,
      trees,
      map,
      reduce,
      iterate
    });
  } catch (err) {
    err.caller = "git.walk";
    throw err;
  }
}
async function writeBlob({ fs, dir, gitdir = join(dir, ".git"), blob }) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("blob", blob);
    return await _writeObject({
      fs: new FileSystem(fs),
      gitdir,
      type: "blob",
      object: blob,
      format: "content"
    });
  } catch (err) {
    err.caller = "git.writeBlob";
    throw err;
  }
}
async function _writeCommit({ fs, gitdir, commit: commit2 }) {
  const object = GitCommit.from(commit2).toObject();
  const oid = await _writeObject({
    gitdir,
    type: "commit",
    object,
    format: "content"
  return oid;
async function writeCommit({
  fs,
  dir,
  gitdir = join(dir, ".git"),
  commit: commit2
}) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("commit", commit2);
    return await _writeCommit({
      fs: new FileSystem(fs),
      gitdir,
      commit: commit2
    });
  } catch (err) {
    err.caller = "git.writeCommit";
    throw err;
  }
async function writeObject({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  type,
  object,
  format = "parsed",
  oid,
  encoding = void 0
}) {
  try {
    const fs = new FileSystem(_fs);
    if (format === "parsed") {
      switch (type) {
        case "commit":
          object = GitCommit.from(object).toObject();
          break;
        case "tree":
          object = GitTree.from(object).toObject();
          break;
        case "blob":
          object = Buffer2.from(object, encoding);
          break;
        case "tag":
          object = GitAnnotatedTag.from(object).toObject();
          break;
        default:
          throw new ObjectTypeError(oid || "", type, "blob|commit|tag|tree");
      }
      format = "content";
    }
    oid = await _writeObject({
      type,
      oid,
      format
  } catch (err) {
    err.caller = "git.writeObject";
    throw err;
  }
}
async function writeRef({
  fs: _fs,
  dir,
  gitdir = join(dir, ".git"),
  ref,
  value,
  force = false,
  symbolic = false
}) {
  try {
    assertParameter("fs", _fs);
    assertParameter("gitdir", gitdir);
    assertParameter("ref", ref);
    assertParameter("value", value);
    const fs = new FileSystem(_fs);
    if (ref !== import_clean_git_ref.default.clean(ref)) {
      throw new InvalidRefNameError(ref, import_clean_git_ref.default.clean(ref));
    }
    if (!force && await GitRefManager.exists({ fs, gitdir, ref })) {
      throw new AlreadyExistsError("ref", ref);
    }
    if (symbolic) {
      await GitRefManager.writeSymbolicRef({
        fs,
        ref,
        value
    } else {
      value = await GitRefManager.resolve({
        ref: value
      });
      await GitRefManager.writeRef({
        fs,
        gitdir,
        ref,
        value
  } catch (err) {
    err.caller = "git.writeRef";
    throw err;
  }
async function _writeTag({ fs, gitdir, tag: tag2 }) {
  const object = GitAnnotatedTag.from(tag2).toObject();
  const oid = await _writeObject({
    fs,
    gitdir,
    type: "tag",
    object,
    format: "content"
  return oid;
async function writeTag({ fs, dir, gitdir = join(dir, ".git"), tag: tag2 }) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("tag", tag2);
    return await _writeTag({
      fs: new FileSystem(fs),
      tag: tag2
  } catch (err) {
    err.caller = "git.writeTag";
    throw err;
  }
async function writeTree({ fs, dir, gitdir = join(dir, ".git"), tree }) {
  try {
    assertParameter("fs", fs);
    assertParameter("gitdir", gitdir);
    assertParameter("tree", tree);
    return await _writeTree({
      fs: new FileSystem(fs),
      gitdir,
      tree
    });
  } catch (err) {
    err.caller = "git.writeTree";
    throw err;
  }
// src/main.ts
var import_obsidian23 = __toModule(require("obsidian"));
// src/promiseQueue.ts
var PromiseQueue = class {
  constructor() {
    this.tasks = [];
  addTask(task) {
    this.tasks.push(task);
    if (this.tasks.length === 1) {
      this.handleTask();
  async handleTask() {
    if (this.tasks.length > 0) {
      this.tasks[0]().finally(() => {
        this.tasks.shift();
        this.handleTask();
      });
// src/settings.ts
var import_obsidian7 = __toModule(require("obsidian"));

// src/isomorphicGit.ts
init_polyfill_buffer();

// node_modules/diff/lib/index.mjs
init_polyfill_buffer();
function Diff() {
}
Diff.prototype = {
  diff: function diff(oldString, newString) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var callback = options.callback;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    this.options = options;
    var self3 = this;
    function done(value) {
      if (callback) {
        setTimeout(function() {
          callback(void 0, value);
        }, 0);
        return true;
        return value;
      }
    }
    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length, oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    if (options.maxEditLength) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    var bestPath = [{
      newPos: -1,
      components: []
    }];
    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    }
    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath = void 0;
        var addPath = bestPath[diagonalPath - 1], removePath = bestPath[diagonalPath + 1], _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
        if (addPath) {
          bestPath[diagonalPath - 1] = void 0;
        var canAdd = addPath && addPath.newPos + 1 < newLen, canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = void 0;
          continue;
        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self3.pushComponent(basePath.components, void 0, true);
          basePath = addPath;
          basePath.newPos++;
          self3.pushComponent(basePath.components, true, void 0);
        _oldPos = self3.extractCommon(basePath, newString, oldString, diagonalPath);
        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self3, basePath.components, newString, oldString, self3.useLongestToken));
          bestPath[diagonalPath] = basePath;
      editLength++;
    }
    if (callback) {
      (function exec() {
        setTimeout(function() {
          if (editLength > maxEditLength) {
            return callback();
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();
        if (ret) {
          return ret;
    }
  },
  pushComponent: function pushComponent(components, added, removed) {
    var last2 = components[components.length - 1];
    if (last2 && last2.added === added && last2.removed === removed) {
      components[components.length - 1] = {
        count: last2.count + 1,
        added,
        removed
      };
    } else {
      components.push({
        count: 1,
        added,
        removed
      });
    }
  },
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length, oldLen = oldString.length, newPos = basePath.newPos, oldPos = newPos - diagonalPath, commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }
    if (commonCount) {
      basePath.components.push({
        count: commonCount
      });
    }
    basePath.newPos = newPos;
    return oldPos;
  },
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  removeEmpty: function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  },
  castInput: function castInput(value) {
    return value;
  },
  tokenize: function tokenize(value) {
    return value.split("");
  },
  join: function join2(chars) {
    return chars.join("");
  }
};
function buildValues(diff2, components, newString, oldString, useLongestToken) {
  var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function(value2, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value2.length ? oldValue : value2;
        });
        component.value = diff2.join(value);
        component.value = diff2.join(newString.slice(newPos, newPos + component.count));
      newPos += component.count;
      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff2.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count;
      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  var lastComponent = components[componentLen - 1];
  if (componentLen > 1 && typeof lastComponent.value === "string" && (lastComponent.added || lastComponent.removed) && diff2.equals("", lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  return components;
}
function clonePath(path2) {
  return {
    newPos: path2.newPos,
    components: path2.components.slice(0)
  };
}
var characterDiff = new Diff();
function diffChars(oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options);
}
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new Diff();
wordDiff.equals = function(left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};
wordDiff.tokenize = function(value) {
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
  for (var i = 0; i < tokens.length - 1; i++) {
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  return tokens;
};
function diffWordsWithSpace(oldStr, newStr, options) {
  return wordDiff.diff(oldStr, newStr, options);
}
var lineDiff = new Diff();
lineDiff.tokenize = function(value) {
  var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];
    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      retLines.push(line);
    }
  return retLines;
function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
var sentenceDiff = new Diff();
sentenceDiff.tokenize = function(value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};
var cssDiff = new Diff();
cssDiff.tokenize = function(value) {
  return value.split(/([{}:;,]|\s+)/);
};
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  return _typeof(obj);
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
    return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new Diff();
jsonDiff.useLongestToken = true;
jsonDiff.tokenize = lineDiff.tokenize;
jsonDiff.castInput = function(value) {
  var _this$options = this.options, undefinedReplacement = _this$options.undefinedReplacement, _this$options$stringi = _this$options.stringifyReplacer, stringifyReplacer = _this$options$stringi === void 0 ? function(k, v) {
    return typeof v === "undefined" ? undefinedReplacement : v;
  } : _this$options$stringi;
  return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
jsonDiff.equals = function(left, right) {
  return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"));
};
function canonicalize(obj, stack, replacementStack, replacer, key2) {
  stack = stack || [];
  replacementStack = replacementStack || [];
  if (replacer) {
    obj = replacer(key2, obj);
  var i;
  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  var canonicalizedObj;
  if (objectPrototypeToString.call(obj) === "[object Array]") {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key2);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  if (_typeof(obj) === "object" && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [], _key;
    for (_key in obj) {
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
    }
    sortedKeys.sort();
    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  return canonicalizedObj;
}
var arrayDiff = new Diff();
arrayDiff.tokenize = function(value) {
  return value.slice();
};
arrayDiff.join = arrayDiff.removeEmpty = function(value) {
  return value;
};
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }
  if (typeof options.context === "undefined") {
    options.context = 4;
  }
  var diff2 = diffLines(oldStr, newStr, options);
  if (!diff2) {
    return;
  diff2.push({
    value: "",
    lines: []
  });
  function contextLines(lines) {
    return lines.map(function(entry) {
      return " " + entry;
    });
  }
  var hunks = [];
  var oldRangeStart = 0, newRangeStart = 0, curRange = [], oldLine = 1, newLine = 1;
  var _loop = function _loop2(i2) {
    var current = diff2[i2], lines = current.lines || current.value.replace(/\n$/, "").split("\n");
    current.lines = lines;
    if (current.added || current.removed) {
      var _curRange;
      if (!oldRangeStart) {
        var prev = diff2[i2 - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;
        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      }
      (_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines.map(function(entry) {
        return (current.added ? "+" : "-") + entry;
      })));
      if (current.added) {
        newLine += lines.length;
        oldLine += lines.length;
    } else {
      if (oldRangeStart) {
        if (lines.length <= options.context * 2 && i2 < diff2.length - 2) {
          var _curRange2;
          (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines)));
          var _curRange3;
          var contextSize = Math.min(lines.length, options.context);
          (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines.slice(0, contextSize))));
          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };
          if (i2 >= diff2.length - 2 && lines.length <= options.context) {
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;
            if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
              curRange.splice(hunk.oldLines, 0, "\\ No newline at end of file");
            }
            if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
              curRange.push("\\ No newline at end of file");
            }
          }
          hunks.push(hunk);
          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
      oldLine += lines.length;
      newLine += lines.length;
    }
  };
  for (var i = 0; i < diff2.length; i++) {
    _loop(i);
  return {
    oldFileName,
    newFileName,
    oldHeader,
    newHeader,
    hunks
  };
}
function formatPatch(diff2) {
  var ret = [];
  if (diff2.oldFileName == diff2.newFileName) {
    ret.push("Index: " + diff2.oldFileName);
  ret.push("===================================================================");
  ret.push("--- " + diff2.oldFileName + (typeof diff2.oldHeader === "undefined" ? "" : "	" + diff2.oldHeader));
  ret.push("+++ " + diff2.newFileName + (typeof diff2.newHeader === "undefined" ? "" : "	" + diff2.newHeader));
  for (var i = 0; i < diff2.hunks.length; i++) {
    var hunk = diff2.hunks[i];
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }
    ret.push("@@ -" + hunk.oldStart + "," + hunk.oldLines + " +" + hunk.newStart + "," + hunk.newLines + " @@");
    ret.push.apply(ret, hunk.lines);
  }
  return ret.join("\n") + "\n";
}
function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  return formatPatch(structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options));
}
function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}

// src/isomorphicGit.ts
var import_obsidian5 = __toModule(require("obsidian"));

// src/gitManager.ts
init_polyfill_buffer();
var GitManager = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.app = plugin.app;
  }
  getVaultPath(path2) {
    if (this.plugin.settings.basePath) {
      return this.plugin.settings.basePath + "/" + path2;
    } else {
      return path2;
    }
  }
  getPath(path2, relativeToVault) {
    return relativeToVault && this.plugin.settings.basePath.length > 0 ? path2.substring(this.plugin.settings.basePath.length + 1) : path2;
  }
  _getTreeStructure(children2, beginLength = 0) {
    const list = [];
    children2 = [...children2];
    while (children2.length > 0) {
      const first2 = children2.first();
      const restPath = first2.path.substring(beginLength);
      if (restPath.contains("/")) {
        const title = restPath.substring(0, restPath.indexOf("/"));
        const childrenWithSameTitle = children2.filter((item) => {
          return item.path.substring(beginLength).startsWith(title + "/");
        });
        childrenWithSameTitle.forEach((item) => children2.remove(item));
        list.push({
          title,
          path: first2.path.substring(0, restPath.indexOf("/") + beginLength),
          children: this._getTreeStructure(childrenWithSameTitle, (beginLength > 0 ? beginLength + title.length : title.length) + 1)
        });
      } else {
        list.push({ title: restPath, statusResult: first2, path: first2.path });
        children2.remove(first2);
    }
    return list;
  simplify(tree) {
    var _a2, _b, _c, _d;
    for (const node of tree) {
      const singleChild = ((_a2 = node.children) == null ? void 0 : _a2.length) == 1;
      const singleChildIsDir = ((_c = (_b = node.children) == null ? void 0 : _b.first()) == null ? void 0 : _c.statusResult) == void 0;
      if (node.children != void 0 && singleChild && singleChildIsDir) {
        node.title += "/" + node.children.first().title;
        node.path = node.children.first().path;
        node.children = node.children.first().children;
      } else if (node.children != void 0) {
        this.simplify(node.children);
      }
      (_d = node.children) == null ? void 0 : _d.sort((a, b) => {
        const dirCompare = (b.statusResult == void 0 ? 1 : 0) - (a.statusResult == void 0 ? 1 : 0);
        if (dirCompare != 0) {
          return dirCompare;
          return a.title.localeCompare(b.title);
      });
    }
    return tree.sort((a, b) => {
      const dirCompare = (b.statusResult == void 0 ? 1 : 0) - (a.statusResult == void 0 ? 1 : 0);
      if (dirCompare != 0) {
        return dirCompare;
      } else {
        return a.title.localeCompare(b.title);
  getTreeStructure(children2) {
    const tree = this._getTreeStructure(children2);
    const res = this.simplify(tree);
    return res;
  async formatCommitMessage(template) {
    let status2;
    if (template.includes("{{numFiles}}")) {
      status2 = await this.status();
      const numFiles = status2.staged.length;
      template = template.replace("{{numFiles}}", String(numFiles));
    }
    if (template.includes("{{hostname}}")) {
      const hostname = this.plugin.localStorage.getHostname() || "";
      template = template.replace("{{hostname}}", hostname);
    }
    if (template.includes("{{files}}")) {
      status2 = status2 != null ? status2 : await this.status();
      const changeset = {};
      status2.staged.forEach((value) => {
        if (value.index in changeset) {
          changeset[value.index].push(value.path);
        } else {
          changeset[value.index] = [value.path];
        }
      });
      const chunks = [];
      for (const [action, files2] of Object.entries(changeset)) {
        chunks.push(action + " " + files2.join(" "));
      const files = chunks.join(", ");
      template = template.replace("{{files}}", files);
    const moment = window.moment;
    template = template.replace("{{date}}", moment().format(this.plugin.settings.commitDateFormat));
    if (this.plugin.settings.listChangedFilesInMessageBody) {
      template = template + "\n\nAffected files:\n" + (status2 != null ? status2 : await this.status()).staged.map((e) => e.path).join("\n");
    }
    return template;
};

// src/myAdapter.ts
init_polyfill_buffer();
var import_obsidian2 = __toModule(require("obsidian"));
var MyAdapter = class {
  constructor(vault, plugin) {
    this.plugin = plugin;
    this.promises = {};
    this.adapter = vault.adapter;
    this.vault = vault;
    this.promises.readFile = this.readFile.bind(this);
    this.promises.writeFile = this.writeFile.bind(this);
    this.promises.readdir = this.readdir.bind(this);
    this.promises.mkdir = this.mkdir.bind(this);
    this.promises.rmdir = this.rmdir.bind(this);
    this.promises.stat = this.stat.bind(this);
    this.promises.unlink = this.unlink.bind(this);
    this.promises.lstat = this.lstat.bind(this);
    this.promises.readlink = this.readlink.bind(this);
    this.promises.symlink = this.symlink.bind(this);
  async readFile(path2, opts) {
    var _a2;
    this.maybeLog("Read: " + path2 + JSON.stringify(opts));
    if (opts == "utf8" || opts.encoding == "utf8") {
      const file = this.vault.getAbstractFileByPath(path2);
      if (file instanceof import_obsidian2.TFile) {
        this.maybeLog("Reuse");
        return this.vault.read(file);
      } else {
        return this.adapter.read(path2);
    } else {
      if (path2.endsWith(".git/index")) {
        return (_a2 = this.index) != null ? _a2 : this.adapter.readBinary(path2);
      const file = this.vault.getAbstractFileByPath(path2);
      if (file instanceof import_obsidian2.TFile) {
        this.maybeLog("Reuse");
        return this.vault.readBinary(file);
      } else {
        return this.adapter.readBinary(path2);
    }
  async writeFile(path2, data) {
    this.maybeLog("Write: " + path2);
    if (typeof data === "string") {
      const file = this.vault.getAbstractFileByPath(path2);
      if (file instanceof import_obsidian2.TFile) {
        return this.vault.modify(file, data);
      } else {
        return this.adapter.write(path2, data);
      }
    } else {
      if (path2.endsWith(".git/index")) {
        this.index = data;
        this.indexmtime = Date.now();
      } else {
        const file = this.vault.getAbstractFileByPath(path2);
        if (file instanceof import_obsidian2.TFile) {
          return this.vault.modifyBinary(file, data);
        } else {
          return this.adapter.writeBinary(path2, data);
        }
      }
    }
  async readdir(path2) {
    if (path2 === ".")
      path2 = "/";
    const res = await this.adapter.list(path2);
    const all = [...res.files, ...res.folders];
    let formattedAll;
    if (path2 !== "/") {
      formattedAll = all.map((e) => (0, import_obsidian2.normalizePath)(e.substring(path2.length)));
    } else {
      formattedAll = all;
    }
    return formattedAll;
  async mkdir(path2) {
    return this.adapter.mkdir(path2);
  }
  async rmdir(path2, opts) {
    var _a2, _b;
    return this.adapter.rmdir(path2, (_b = (_a2 = opts == null ? void 0 : opts.options) == null ? void 0 : _a2.recursive) != null ? _b : false);
  }
  async stat(path2) {
    if (path2.endsWith(".git/index")) {
      if (this.index !== void 0 && this.indexctime != void 0 && this.indexmtime != void 0) {
          isFile: () => true,
          isDirectory: () => false,
          isSymbolicLink: () => false,
          size: this.index.length,
          type: "file",
          ctimeMs: this.indexctime,
          mtimeMs: this.indexmtime
        };
      } else {
        const stat = await this.adapter.stat(path2);
        if (stat == void 0) {
          throw { "code": "ENOENT" };
        }
        this.indexctime = stat.ctime;
        this.indexmtime = stat.mtime;
        return {
          ctimeMs: stat.ctime,
          mtimeMs: stat.mtime,
          size: stat.size,
          type: "file",
          isFile: () => true,
          isDirectory: () => false,
          isSymbolicLink: () => false
    }
    if (path2 === ".")
      path2 = "/";
    const file = this.vault.getAbstractFileByPath(path2);
    this.maybeLog("Stat: " + path2);
    if (file instanceof import_obsidian2.TFile) {
      this.maybeLog("Reuse stat");
      return {
        ctimeMs: file.stat.ctime,
        mtimeMs: file.stat.mtime,
        size: file.stat.size,
        type: "file",
        isFile: () => true,
        isDirectory: () => false,
        isSymbolicLink: () => false
      };
    } else {
      const stat = await this.adapter.stat(path2);
      if (stat) {
        return {
          ctimeMs: stat.ctime,
          mtimeMs: stat.mtime,
          size: stat.size,
          type: stat.type === "folder" ? "directory" : stat.type,
          isFile: () => stat.type === "file",
          isDirectory: () => stat.type === "folder",
          isSymbolicLink: () => false
        };
      } else {
        throw { "code": "ENOENT" };
      }
    }
  async unlink(path2) {
    return this.adapter.remove(path2);
  async lstat(path2) {
    return this.stat(path2);
  async readlink(path2) {
    throw new Error(`readlink of (${path2}) is not implemented.`);
  async symlink(path2) {
    throw new Error(`symlink of (${path2}) is not implemented.`);
  async saveAndClear() {
    if (this.index !== void 0) {
      await this.adapter.writeBinary(this.plugin.gitManager.getVaultPath(".git/index"), this.index, {
        ctime: this.indexctime,
        mtime: this.indexmtime
      });
    }
    this.index = void 0;
    this.indexctime = void 0;
    this.indexmtime = void 0;
  maybeLog(text2) {
};

// src/types.ts
init_polyfill_buffer();
var PluginState;
(function(PluginState2) {
  PluginState2[PluginState2["idle"] = 0] = "idle";
  PluginState2[PluginState2["status"] = 1] = "status";
  PluginState2[PluginState2["pull"] = 2] = "pull";
  PluginState2[PluginState2["add"] = 3] = "add";
  PluginState2[PluginState2["commit"] = 4] = "commit";
  PluginState2[PluginState2["push"] = 5] = "push";
  PluginState2[PluginState2["conflicted"] = 6] = "conflicted";
})(PluginState || (PluginState = {}));
var FileType;
(function(FileType2) {
  FileType2[FileType2["staged"] = 0] = "staged";
  FileType2[FileType2["changed"] = 1] = "changed";
  FileType2[FileType2["pulled"] = 2] = "pulled";
})(FileType || (FileType = {}));

// src/ui/modals/generalModal.ts
init_polyfill_buffer();
var import_obsidian3 = __toModule(require("obsidian"));
var generalModalConfigDefaults = {
  options: [],
  placeholder: "",
  allowEmpty: false,
  onlySelection: false,
  initialValue: void 0
};
var GeneralModal = class extends import_obsidian3.SuggestModal {
  constructor(config) {
    super(app);
    this.config = { ...generalModalConfigDefaults, ...config };
    this.setPlaceholder(this.config.placeholder);
  open() {
    super.open();
    if (this.config.initialValue != void 0) {
      this.inputEl.value = this.config.initialValue;
      this.inputEl.dispatchEvent(new Event("input"));
    }
    return new Promise((resolve) => {
      this.resolve = resolve;
  selectSuggestion(value, evt) {
    if (this.resolve) {
      let res;
      if (this.config.allowEmpty && value === " ")
        res = "";
      else if (value === "...")
        res = void 0;
      else
        res = value;
      this.resolve(res);
    }
    super.selectSuggestion(value, evt);
  onClose() {
    if (this.resolve)
      this.resolve(void 0);
  getSuggestions(query) {
    if (this.config.onlySelection) {
      return this.config.options;
    } else if (this.config.allowEmpty) {
      return [query.length > 0 ? query : " ", ...this.config.options];
    } else {
      return [query.length > 0 ? query : "...", ...this.config.options];
    }
  renderSuggestion(value, el) {
    el.setText(value);
  onChooseSuggestion(item, evt) {
};

// src/utils.ts
init_polyfill_buffer();
var import_obsidian4 = __toModule(require("obsidian"));
var worthWalking2 = (filepath, root) => {
  if (filepath === "." || root == null || root.length === 0 || root === ".") {
    return true;
  if (root.length >= filepath.length) {
    return root.startsWith(filepath);
  } else {
    return filepath.startsWith(root);
};
function getNewLeaf(event) {
  let leaf;
  if (event) {
    if (event.button === 0 || event.button === 1) {
      const type = import_obsidian4.Keymap.isModEvent(event);
      leaf = app.workspace.getLeaf(type);
    }
  } else {
    leaf = app.workspace.getLeaf(false);
  return leaf;
}

// src/isomorphicGit.ts
var IsomorphicGit = class extends GitManager {
  constructor(plugin) {
    super(plugin);
    this.FILE = 0;
    this.HEAD = 1;
    this.WORKDIR = 2;
    this.STAGE = 3;
    this.status_mapping = {
      "000": "  ",
      "003": "AD",
      "020": "??",
      "022": "A ",
      "023": "AM",
      "100": "D ",
      "101": " D",
      "103": "MD",
      "110": "DA",
      "111": "  ",
      "120": "DA",
      "121": " M",
      "122": "M ",
      "123": "MM"
    };
    this.noticeLength = 999999;
    this.fs = new MyAdapter(this.app.vault, this.plugin);
  getRepo() {
    return {
      fs: this.fs,
      dir: this.plugin.settings.basePath,
      onAuth: () => {
        var _a2;
          username: this.plugin.settings.username,
          password: (_a2 = this.plugin.localStorage.getPassword()) != null ? _a2 : void 0
      },
      onAuthFailure: async () => {
        new import_obsidian5.Notice("Authentication failed. Please try with different credentials");
        const username = await new GeneralModal({ placeholder: "Specify your username" }).open();
        if (username) {
          const password = await new GeneralModal({ placeholder: "Specify your password/personal access token" }).open();
          if (password) {
            this.plugin.settings.username = username;
            await this.plugin.saveSettings();
            this.plugin.localStorage.setPassword(password);
            return {
              username,
              password
            };
        }
        return { cancel: true };
      },
      http: {
        async request({
          url,
          method,
          headers,
          body
        }) {
          if (body) {
            body = await collect2(body);
            body = body.buffer;
          }
          const res = await (0, import_obsidian5.requestUrl)({ url, method, headers, body, throw: false });
          return {
            url,
            method,
            headers: res.headers,
            body: [new Uint8Array(res.arrayBuffer)],
            statusCode: res.status,
            statusMessage: res.status.toString()
          };
        }
    };
  async wrapFS(call) {
    try {
      const res = await call;
      await this.fs.saveAndClear();
      return res;
    } catch (error) {
      await this.fs.saveAndClear();
      throw error;
    }
  async status() {
    const notice = new import_obsidian5.Notice("Getting status...", this.noticeLength);
    try {
      this.plugin.setState(PluginState.status);
      const status2 = (await this.wrapFS(isomorphic_git_default.statusMatrix({ ...this.getRepo() }))).map((row) => this.getFileStatusResult(row));
      const changed = status2.filter((fileStatus) => fileStatus.working_dir !== " ");
      const staged = status2.filter((fileStatus) => fileStatus.index !== " " && fileStatus.index !== "U");
      const conflicted = [];
      notice.hide();
      return { changed, staged, conflicted };
    } catch (error) {
      notice.hide();
      this.plugin.displayError(error);
      throw error;
    }
  }
  async commitAll({ message, status: status2, unstagedFiles }) {
    try {
      await this.stageAll({ status: status2, unstagedFiles });
      return this.commit(message);
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  async commit(message) {
    try {
      this.plugin.setState(PluginState.commit);
      const formatMessage = await this.formatCommitMessage(message);
      const hadConflict = this.plugin.localStorage.getConflict() === "true";
      let parent = void 0;
      if (hadConflict) {
        const branchInfo = await this.branchInfo();
        parent = [branchInfo.current, branchInfo.tracking];
      }
      await this.wrapFS(isomorphic_git_default.commit({
        ...this.getRepo(),
        message: formatMessage,
        parent
      }));
      this.plugin.localStorage.setConflict("false");
      return;
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async stage(filepath, relativeToVault) {
    const gitPath = this.getPath(filepath, relativeToVault);
    let vaultPath;
    if (relativeToVault) {
      vaultPath = filepath;
    } else {
      vaultPath = this.getVaultPath(filepath);
    }
    try {
      this.plugin.setState(PluginState.add);
      if (await this.app.vault.adapter.exists(vaultPath)) {
        await this.wrapFS(isomorphic_git_default.add({ ...this.getRepo(), filepath: gitPath }));
      } else {
        await this.wrapFS(isomorphic_git_default.remove({ ...this.getRepo(), filepath: gitPath }));
      }
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async stageAll({ dir, status: status2, unstagedFiles }) {
    try {
      if (status2) {
        await Promise.all(status2.changed.map((file) => file.working_dir !== "D" ? this.wrapFS(isomorphic_git_default.add({ ...this.getRepo(), filepath: file.path })) : isomorphic_git_default.remove({ ...this.getRepo(), filepath: file.path })));
      } else {
        const filesToStage = unstagedFiles != null ? unstagedFiles : await this.getUnstagedFiles(dir != null ? dir : ".");
        await Promise.all(filesToStage.map(({ filepath, deleted }) => deleted ? isomorphic_git_default.remove({ ...this.getRepo(), filepath }) : this.wrapFS(isomorphic_git_default.add({ ...this.getRepo(), filepath }))));
      }
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async unstage(filepath, relativeToVault) {
    try {
      this.plugin.setState(PluginState.add);
      filepath = this.getPath(filepath, relativeToVault);
      await this.wrapFS(isomorphic_git_default.resetIndex({ ...this.getRepo(), filepath }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async unstageAll({ dir, status: status2 }) {
    try {
      let staged;
      if (status2) {
        staged = status2.staged.map((file) => file.path);
      } else {
        const res = await this.getStagedFiles(dir != null ? dir : ".");
        staged = res.map(({ filepath }) => filepath);
      }
      await Promise.all(staged.map((file) => this.unstage(file, false)));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async discard(filepath) {
    try {
      this.plugin.setState(PluginState.add);
      await this.wrapFS(isomorphic_git_default.checkout({ ...this.getRepo(), filepaths: [filepath], force: true }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  getProgressText(action, event) {
    let out = `${action} progress:`;
    if (event.phase) {
      out = `${out} ${event.phase}:`;
    }
    if (event.loaded) {
      out = `${out} ${event.loaded}`;
      if (event.total) {
        out = `${out} of ${event.total}`;
      }
    }
    return out;
  }
  resolveRef(ref) {
    return this.wrapFS(isomorphic_git_default.resolveRef({ ...this.getRepo(), ref }));
  }
  async pull() {
    const progressNotice = new import_obsidian5.Notice("Initializing pull", this.noticeLength);
    try {
      this.plugin.setState(PluginState.pull);
      const localCommit = await this.resolveRef("HEAD");
      await this.fetch();
      const branchInfo = await this.branchInfo();
      await this.wrapFS(isomorphic_git_default.merge({
        ...this.getRepo(),
        ours: branchInfo.current,
        theirs: branchInfo.tracking,
        abortOnConflict: false
      }));
      await this.wrapFS(isomorphic_git_default.checkout({
        ...this.getRepo(),
        ref: branchInfo.current,
        onProgress: (progress) => {
          progressNotice.noticeEl.innerText = this.getProgressText("Checkout", progress);
        },
        remote: branchInfo.remote
      }));
      progressNotice.hide();
      const upstreamCommit = await this.resolveRef("HEAD");
      this.plugin.lastUpdate = Date.now();
      const changedFiles = await this.getFileChangesCount(localCommit, upstreamCommit);
      new import_obsidian5.Notice("Finished pull");
      return changedFiles.map((file) => ({
        path: file.path,
        working_dir: "P",
        index: "P",
        vault_path: this.getVaultPath(file.path)
      }));
    } catch (error) {
      progressNotice.hide();
      if (error instanceof Errors.MergeConflictError) {
        this.plugin.handleConflict(error.data.filepaths.map((file) => this.getVaultPath(file)));
      }
      this.plugin.displayError(error);
      throw error;
    }
  }
  async push() {
    if (!await this.canPush()) {
      return 0;
    }
    const progressNotice = new import_obsidian5.Notice("Initializing push", this.noticeLength);
    try {
      this.plugin.setState(PluginState.status);
      const status2 = await this.branchInfo();
      const trackingBranch = status2.tracking;
      const currentBranch2 = status2.current;
      const numChangedFiles = (await this.getFileChangesCount(currentBranch2, trackingBranch)).length;
      this.plugin.setState(PluginState.push);
      await this.wrapFS(isomorphic_git_default.push({
        ...this.getRepo(),
        onProgress: (progress) => {
          progressNotice.noticeEl.innerText = this.getProgressText("Pushing", progress);
        }
      }));
      progressNotice.hide();
      return numChangedFiles;
    } catch (error) {
      progressNotice.hide();
      this.plugin.displayError(error);
      throw error;
    }
  }
  async canPush() {
    const status2 = await this.branchInfo();
    const trackingBranch = status2.tracking;
    const currentBranch2 = status2.current;
    const current = await this.resolveRef(currentBranch2);
    const tracking = await this.resolveRef(trackingBranch);
    return current != tracking;
  }
  async checkRequirements() {
    const headExists = await this.plugin.app.vault.adapter.exists(`${this.getRepo().dir}/.git/HEAD`);
    return headExists ? "valid" : "missing-repo";
  }
  async branchInfo() {
    var _a2, _b;
    try {
      const current = await isomorphic_git_default.currentBranch(this.getRepo()) || "";
      const branches = await isomorphic_git_default.listBranches(this.getRepo());
      const remote = (_a2 = await this.getConfig(`branch.${current}.remote`)) != null ? _a2 : "origin";
      const trackingBranch = (_b = await this.getConfig(`branch.${current}.merge`)) == null ? void 0 : _b.split("refs/heads")[1];
      const tracking = trackingBranch ? remote + trackingBranch : void 0;
      return {
        current,
        tracking,
        branches,
        remote
      };
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async getCurrentRemote() {
    var _a2;
    const current = await isomorphic_git_default.currentBranch(this.getRepo()) || "";
    const remote = (_a2 = await this.getConfig(`branch.${current}.remote`)) != null ? _a2 : "origin";
    return remote;
  }
  async checkout(branch2) {
    try {
      return this.wrapFS(isomorphic_git_default.checkout({
        ...this.getRepo(),
        ref: branch2
      }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async createBranch(branch2) {
    try {
      await this.wrapFS(isomorphic_git_default.branch({ ...this.getRepo(), ref: branch2, checkout: true }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async deleteBranch(branch2) {
    try {
      await this.wrapFS(isomorphic_git_default.deleteBranch({ ...this.getRepo(), ref: branch2 }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async branchIsMerged(branch2) {
    return true;
  }
  async init() {
    try {
      await this.wrapFS(isomorphic_git_default.init(this.getRepo()));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async clone(url, dir) {
    const progressNotice = new import_obsidian5.Notice("Initializing clone", this.noticeLength);
    try {
      await this.wrapFS(isomorphic_git_default.clone({
        ...this.getRepo(),
        dir,
        url,
        onProgress: (progress) => {
          progressNotice.noticeEl.innerText = this.getProgressText("Cloning", progress);
        }
      }));
      progressNotice.hide();
    } catch (error) {
      progressNotice.hide();
      this.plugin.displayError(error);
      throw error;
    }
  }
  async setConfig(path2, value) {
    try {
      return this.wrapFS(isomorphic_git_default.setConfig({
        ...this.getRepo(),
        path: path2,
        value
      }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async getConfig(path2) {
    try {
      return this.wrapFS(isomorphic_git_default.getConfig({
        ...this.getRepo(),
        path: path2
      }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async fetch(remote) {
    const progressNotice = new import_obsidian5.Notice("Initializing fetch", this.noticeLength);
    try {
      const args = {
        ...this.getRepo(),
        onProgress: (progress) => {
          progressNotice.noticeEl.innerText = this.getProgressText("Fetching", progress);
        },
        remote: remote != null ? remote : await this.getCurrentRemote()
      };
      await this.wrapFS(isomorphic_git_default.fetch(args));
      progressNotice.hide();
    } catch (error) {
      this.plugin.displayError(error);
      progressNotice.hide();
      throw error;
    }
  }
  async setRemote(name, url) {
    try {
      await this.wrapFS(isomorphic_git_default.addRemote({ ...this.getRepo(), remote: name, url }));
    } catch (error) {
      this.plugin.displayError(error);
      throw error;
    }
  }
  async getRemoteBranches(remote) {
    let remoteBranches = [];
    remoteBranches.push(...await this.wrapFS(isomorphic_git_default.listBranches({ ...this.getRepo(), remote })));
    remoteBranches.remove("HEAD");
    remoteBranches = remoteBranches.map((e) => `${remote}/${e}`);
    return remoteBranches;
  }
  async getRemotes() {
    return (await this.wrapFS(isomorphic_git_default.listRemotes({ ...this.getRepo() }))).map((remoteUrl) => remoteUrl.remote);
  }
  async removeRemote(remoteName) {
    await this.wrapFS(isomorphic_git_default.deleteRemote({ ...this.getRepo(), remote: remoteName }));
  }
  async getRemoteUrl(remote) {
    return (await this.wrapFS(isomorphic_git_default.listRemotes({ ...this.getRepo() }))).filter((item) => item.remote == remote)[0].url;
  }
  updateBasePath(basePath) {
    this.getRepo().dir = basePath;
  }
  async updateUpstreamBranch(remoteBranch) {
    const [remote, branch2] = remoteBranch.split("/");
    const branchInfo = await this.branchInfo();
    await this.setConfig(`branch.${branchInfo.current}.merge`, `refs/heads/${branch2}`);
    await this.setConfig(`branch.${branch2}.remote`, remote);
  }
  updateGitPath(gitPath) {
    return;
  }
  async getFileChangesCount(commitHash1, commitHash2) {
    return this.walkDifference({ walkers: [isomorphic_git_default.TREE({ ref: commitHash1 }), isomorphic_git_default.TREE({ ref: commitHash2 })] });
  }
  async walkDifference({ walkers, dir: base }) {
    const res = await this.wrapFS(isomorphic_git_default.walk({
      ...this.getRepo(),
      trees: walkers,
      map: async function(filepath, [A, B]) {
        if (!worthWalking2(filepath, base)) {
          return null;
        }
        if (await (A == null ? void 0 : A.type()) === "tree" || await (B == null ? void 0 : B.type()) === "tree") {
          return;
        }
        const Aoid = await (A == null ? void 0 : A.oid());
        const Boid = await (B == null ? void 0 : B.oid());
        let type = "equal";
        if (Aoid !== Boid) {
          type = "modify";
        }
        if (Aoid === void 0) {
          type = "add";
        }
        if (Boid === void 0) {
          type = "remove";
        }
        if (Aoid === void 0 && Boid === void 0) {
          console.log("Something weird happened:");
          console.log(A);
          console.log(B);
        }
        if (type === "equal") {
          return;
        }
        return {
          path: filepath,
          type
        };
      }
    }));
    return res;
  }
  async getStagedFiles(dir = ".") {
    const res = await this.walkDifference({
      walkers: [isomorphic_git_default.TREE({ ref: "HEAD" }), isomorphic_git_default.STAGE()],
      dir
    });
    return res.map((file) => {
      return {
        vault_path: this.getVaultPath(file.path),
        filepath: file.path
      };
    });
  }
  async getUnstagedFiles(base = ".") {
    const notice = new import_obsidian5.Notice("Getting status...", this.noticeLength);
    try {
      const repo = this.getRepo();
      const res = await this.wrapFS(isomorphic_git_default.walk({
        ...repo,
        trees: [isomorphic_git_default.WORKDIR(), isomorphic_git_default.STAGE()],
        map: async function(filepath, [workdir, stage]) {
          if (!stage && workdir) {
            const isIgnored2 = await isomorphic_git_default.isIgnored({
              ...repo,
              filepath
            });
            if (isIgnored2) {
              return null;
            }
          }
          if (!worthWalking2(filepath, base)) {
            return null;
          }
          const [workdirType, stageType] = await Promise.all([
            workdir && workdir.type(),
            stage && stage.type()
          ]);
          const isBlob = [workdirType, stageType].includes("blob");
          if ((workdirType === "tree" || workdirType === "special") && !isBlob)
            return;
          if (stageType === "commit")
            return null;
          if ((stageType === "tree" || stageType === "special") && !isBlob)
            return;
          const stageOid = stageType === "blob" ? await stage.oid() : void 0;
          let workdirOid;
          if (workdirType === "blob" && stageType !== "blob") {
            workdirOid = "42";
          } else if (workdirType === "blob") {
            workdirOid = await workdir.oid();
          }
          if (!workdirOid) {
            return {
              filepath,
              deleted: true
            };
          }
          if (workdirOid !== stageOid) {
            return {
              filepath,
              deleted: false
            };
          }
          return null;
        }
      }));
      notice.hide();
      return res;
    } catch (error) {
      notice.hide();
      this.plugin.displayError(error);
      throw error;
    }
  }
  async getDiffString(filePath, stagedChanges = false) {
    const map = async (file, [A]) => {
      if (filePath == file) {
        const oid = await A.oid();
        const contents = await isomorphic_git_default.readBlob({ ...this.getRepo(), oid });
        return contents.blob;
      }
    };
    const stagedBlob = (await isomorphic_git_default.walk({
      ...this.getRepo(),
      trees: [isomorphic_git_default.STAGE()],
      map
    })).first();
    const stagedContent = new TextDecoder().decode(stagedBlob);
    if (stagedChanges) {
      const headBlob = await readBlob({ ...this.getRepo(), filepath: filePath, oid: await this.resolveRef("HEAD") });
      const headContent = new TextDecoder().decode(headBlob.blob);
      const diff2 = createPatch(filePath, headContent, stagedContent);
      return diff2;
    } else {
      let workdirContent;
      if (await app.vault.adapter.exists(filePath)) {
        workdirContent = await app.vault.adapter.read(filePath);
      } else {
        workdirContent = "";
      }
      const diff2 = createPatch(filePath, stagedContent, workdirContent);
      return diff2;
    }
  }
  getFileStatusResult(row) {
    const status2 = this.status_mapping[`${row[this.HEAD]}${row[this.WORKDIR]}${row[this.STAGE]}`];
    return {
      index: status2[0] == "?" ? "U" : status2[0],
      working_dir: status2[1] == "?" ? "U" : status2[1],
      path: row[this.FILE],
      vault_path: this.getVaultPath(row[this.FILE])
    };
  }
};
async function forAwait2(iterable, cb) {
  const iter = getIterator2(iterable);
  while (true) {
    const { value, done } = await iter.next();
    if (value)
      await cb(value);
    if (done)
      break;
  }
  if (iter.return)
    iter.return();
async function collect2(iterable) {
  let size = 0;
  const buffers = [];
  await forAwait2(iterable, (value) => {
    buffers.push(value);
    size += value.byteLength;
  const result = new Uint8Array(size);
  let nextIndex = 0;
  for (const buffer2 of buffers) {
    result.set(buffer2, nextIndex);
    nextIndex += buffer2.byteLength;
  }
  return result;
var import_obsidian6 = __toModule(require("obsidian"));
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp2(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  const config = Object.assign(__spreadValues({ baseDir }, defaultOptions), ...options.filter((o) => typeof o === "object" && o));
function parseStringResponse(result, parsers12, texts, trim = true) {
      parsers12.some(({ parse: parse2 }) => parse2(line, result));
        return __async(this, null, function* () {
        return __async(this, null, function* () {
        return __async(this, null, function* () {
          const { error } = this._plugins.exec("task.error", { error: rejection }, __spreadValues(__spreadValues({}, pluginContext(task, args)), result));
        return __async(this, null, function* () {
            this._plugins.exec("spawn.before", void 0, __spreadProps(__spreadValues({}, pluginContext(task, args)), {
            this._plugins.exec("spawn.after", void 0, __spreadProps(__spreadValues({}, pluginContext(task, args)), {
        this._plugins.exec("spawn.before", void 0, __spreadProps(__spreadValues({}, pluginContext(task, args)), {
        result.ref = __spreadProps(__spreadValues({}, result.ref || {}), {
        result.branch = __spreadProps(__spreadValues({}, result.branch || {}), {
      return __spreadValues(__spreadValues({}, pushDetail), responseDetail);
      return `${this.major}.${this.minor}.${this.patch}`;
        parser: versionParser,
function versionParser(stdOut) {
  if (stdOut === NOT_INSTALLED) {
    return notInstalledResponse();
  }
  return parseStringResponse(versionResponse(0, 0, 0, stdOut), parsers7, stdOut);
}
var parsers7;
    parsers7 = [
      new LineParser(/version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/, (result, [major, minor, patch, agent = ""]) => {
        Object.assign(result, versionResponse(asNumber(major), asNumber(minor), asNumber(patch), agent));
      }),
      new LineParser(/version (\d+)\.(\d+)\.(\D+)(.+)?$/, (result, [major, minor, patch, agent = ""]) => {
        Object.assign(result, versionResponse(asNumber(major), asNumber(minor), patch, agent));
      })
    ];
var parsers8;
    parsers8 = [
      return parseStringResponse(new BranchDeletionBatch(), parsers8, [stdOut, stdErr]);
  return parseStringResponse(new BranchSummaryResult(), parsers9, stdOut);
var parsers9;
    parsers9 = [
  return parseStringResponse(result, parsers10, [stdOut, stdErr]);
var parsers10;
    parsers10 = [
  return parseStringResponse({ moves: [] }, parsers11, stdOut);
var parsers11;
    parsers11 = [
      return __async(this, arguments, function* (_data, { spawned, close }) {
      return __spreadValues(__spreadValues({}, options), data);
  async setGitInstance(ignoreError = false) {
    if (this.isGitInstalled()) {
      const adapter = this.app.vault.adapter;
      const path2 = adapter.getBasePath();
      let basePath = path2;
      if (this.plugin.settings.basePath) {
        const exists2 = await adapter.exists((0, import_obsidian6.normalizePath)(this.plugin.settings.basePath));
        if (exists2) {
          basePath = path2 + import_path.sep + this.plugin.settings.basePath;
        } else if (!ignoreError) {
          new import_obsidian6.Notice("ObsidianGit: Base path does not exist");
        }
      }
      this.git = esm_default({
        baseDir: basePath,
        binary: this.plugin.localStorage.getGitPath() || void 0,
        config: ["core.quotepath=off"]
      });
      this.git.cwd(await this.git.revparse("--show-toplevel"));
    }
  }
  async status() {
    this.plugin.setState(PluginState.status);
    const status2 = await this.git.status((err) => this.onError(err));
    this.plugin.setState(PluginState.idle);
    return {
      changed: status2.files.filter((e) => e.working_dir !== " ").map((e) => {
        const res = this.formatPath(e);
        return {
          path: res.path,
          from: res.from,
          working_dir: e.working_dir === "?" ? "U" : e.working_dir,
          vault_path: this.getVaultPath(res.path)
        };
      }),
      staged: status2.files.filter((e) => e.index !== " " && e.index != "?").map((e) => {
        const res = this.formatPath(e, e.index === "R");
        return {
          path: res.path,
          from: res.from,
          index: e.index,
          vault_path: this.getVaultPath(res.path)
        };
      }),
      conflicted: status2.conflicted.map((path2) => this.formatPath({ path: path2 }).path)
    };
  async commitAll({ message }) {
    if (this.plugin.settings.updateSubmodules) {
      this.plugin.setState(PluginState.commit);
      await new Promise(async (resolve, reject) => {
        this.git.outputHandler(async (cmd, stdout, stderr, args) => {
          if (!(args.contains("submodule") && args.contains("foreach")))
            return;
          let body = "";
          const root = this.app.vault.adapter.getBasePath() + (this.plugin.settings.basePath ? "/" + this.plugin.settings.basePath : "");
          stdout.on("data", (chunk) => {
            body += chunk.toString("utf8");
          });
          stdout.on("end", async () => {
            const submods = body.split("\n");
            const strippedSubmods = submods.map((i) => {
              const submod = i.match(/'([^']*)'/);
              if (submod != void 0) {
                return root + "/" + submod[1] + import_path.sep;
              }
            strippedSubmods.reverse();
            for (const item of strippedSubmods) {
              if (item != void 0) {
                await this.git.cwd({ path: item, root: false }).add("-A", (err) => this.onError(err));
                await this.git.cwd({ path: item, root: false }).commit(await this.formatCommitMessage(message), (err) => this.onError(err));
            }
            resolve();
        });
        await this.git.subModule(["foreach", "--recursive", ""]);
        this.git.outputHandler(() => {
        });
      });
    }
    this.plugin.setState(PluginState.add);
    await this.git.add("-A", (err) => this.onError(err));
    this.plugin.setState(PluginState.commit);
    return (await this.git.commit(await this.formatCommitMessage(message), (err) => this.onError(err))).summary.changes;
  async commit(message) {
    this.plugin.setState(PluginState.commit);
    const res = (await this.git.commit(await this.formatCommitMessage(message), (err) => this.onError(err))).summary.changes;
    this.plugin.setState(PluginState.idle);
    return res;
  async stage(path2, relativeToVault) {
    this.plugin.setState(PluginState.add);
    path2 = this.getPath(path2, relativeToVault);
    await this.git.add(["--", path2], (err) => this.onError(err));
    this.plugin.setState(PluginState.idle);
  }
  async stageAll({ dir }) {
    this.plugin.setState(PluginState.add);
    await this.git.add(dir != null ? dir : "-A", (err) => this.onError(err));
    this.plugin.setState(PluginState.idle);
  }
  async unstageAll() {
    this.plugin.setState(PluginState.add);
    await this.git.reset([], (err) => this.onError(err));
    this.plugin.setState(PluginState.idle);
  }
  async unstage(path2, relativeToVault) {
    this.plugin.setState(PluginState.add);
    path2 = this.getPath(path2, relativeToVault);
    await this.git.reset(["--", path2], (err) => this.onError(err));
    this.plugin.setState(PluginState.idle);
  }
  async discard(filepath) {
    this.plugin.setState(PluginState.add);
    await this.git.checkout(["--", filepath], (err) => this.onError(err));
    this.plugin.setState(PluginState.idle);
  }
  async pull() {
    this.plugin.setState(PluginState.pull);
    if (this.plugin.settings.updateSubmodules)
      await this.git.subModule(["update", "--remote", "--merge", "--recursive"], (err) => this.onError(err));
    const branchInfo = await this.branchInfo();
    const localCommit = await this.git.revparse([branchInfo.current], (err) => this.onError(err));
    await this.git.fetch((err) => this.onError(err));
    const upstreamCommit = await this.git.revparse([branchInfo.tracking], (err) => this.onError(err));
    if (localCommit !== upstreamCommit) {
      if (this.plugin.settings.syncMethod === "merge" || this.plugin.settings.syncMethod === "rebase") {
        try {
          switch (this.plugin.settings.syncMethod) {
            case "merge":
              await this.git.merge([branchInfo.tracking]);
              break;
            case "rebase":
              await this.git.rebase([branchInfo.tracking]);
        } catch (err) {
          this.plugin.displayError(`Pull failed (${this.plugin.settings.syncMethod}): ${err.message}`);
          return;
        }
      } else if (this.plugin.settings.syncMethod === "reset") {
        try {
          await this.git.raw(["update-ref", `refs/heads/${branchInfo.current}`, upstreamCommit], (err) => this.onError(err));
          await this.unstageAll();
        } catch (err) {
          this.plugin.displayError(`Sync failed (${this.plugin.settings.syncMethod}): ${err.message}`);
      const afterMergeCommit = await this.git.revparse([branchInfo.current], (err) => this.onError(err));
      const filesChanged = await this.git.diff([`${localCommit}..${afterMergeCommit}`, "--name-only"]);
      return filesChanged.split(/\r\n|\r|\n/).filter((value) => value.length > 0).map((e) => {
        return {
          path: e,
          working_dir: "P",
          vault_path: this.getVaultPath(e)
        };
      });
    } else {
      return [];
    }
  async push() {
    this.plugin.setState(PluginState.status);
    const status2 = await this.git.status();
    const trackingBranch = status2.tracking;
    const currentBranch2 = status2.current;
    const remoteChangedFiles = (await this.git.diffSummary([currentBranch2, trackingBranch, "--"], (err) => this.onError(err))).changed;
    this.plugin.setState(PluginState.push);
    if (this.plugin.settings.updateSubmodules) {
      await this.git.env({ ...process.env, "OBSIDIAN_GIT": 1 }).subModule(["foreach", "--recursive", `tracking=$(git for-each-ref --format='%(upstream:short)' "$(git symbolic-ref -q HEAD)"); echo $tracking; if [ ! -z "$(git diff --shortstat $tracking)" ]; then git push; fi`], (err) => this.onError(err));
    }
    await this.git.env({ ...process.env, "OBSIDIAN_GIT": 1 }).push((err) => this.onError(err));
    return remoteChangedFiles;
  async canPush() {
    if (this.plugin.settings.updateSubmodules === true) {
      return true;
    }
    const status2 = await this.git.status((err) => this.onError(err));
    const trackingBranch = status2.tracking;
    const currentBranch2 = status2.current;
    const remoteChangedFiles = (await this.git.diffSummary([currentBranch2, trackingBranch, "--"])).changed;
    return remoteChangedFiles !== 0;
  async checkRequirements() {
    if (!this.isGitInstalled()) {
      return "missing-git";
    }
    if (!await this.git.checkIsRepo()) {
      return "missing-repo";
    }
    return "valid";
  async branchInfo() {
    const status2 = await this.git.status((err) => this.onError(err));
    const branches = await this.git.branch(["--no-color"], (err) => this.onError(err));
    return {
      current: status2.current || void 0,
      tracking: status2.tracking || void 0,
      branches: branches.all
    };
  async getRemoteUrl(remote) {
    return await this.git.remote(["get-url", remote], (err, url) => this.onError(err)) || void 0;
  async log(file, relativeToVault = true) {
    const path2 = this.getPath(file, relativeToVault);
    const res = await this.git.log({ file: path2 }, (err) => this.onError(err));
    return res.all;
  async show(commitHash, file, relativeToVault = true) {
    const path2 = this.getPath(file, relativeToVault);
    return this.git.show([commitHash + ":" + path2], (err) => this.onError(err));
  async checkout(branch2) {
    await this.git.checkout(branch2, (err) => this.onError(err));
  async createBranch(branch2) {
    await this.git.checkout(["-b", branch2], (err) => this.onError(err));
  async deleteBranch(branch2, force) {
    await this.git.branch([force ? "-D" : "-d", branch2], (err) => this.onError(err));
  async branchIsMerged(branch2) {
    const notMergedBranches = await this.git.branch(["--no-merged"], (err) => this.onError(err));
    return !notMergedBranches.all.contains(branch2);
  async init() {
    await this.git.init(false, (err) => this.onError(err));
  async clone(url, dir) {
    await this.git.clone(url, path.join(this.app.vault.adapter.getBasePath(), dir), [], (err) => this.onError(err));
  async setConfig(path2, value) {
    await this.git.addConfig(path2, value, (err) => this.onError(err));
  async getConfig(path2) {
    const config = await this.git.listConfig((err) => this.onError(err));
    return config.all[path2];
  async fetch(remote) {
    await this.git.fetch(remote != void 0 ? [remote] : [], (err) => this.onError(err));
  async setRemote(name, url) {
    if ((await this.getRemotes()).includes(name))
      await this.git.remote(["set-url", name, url], (err) => this.onError(err));
    else {
      await this.git.remote(["add", name, url], (err) => this.onError(err));
    }
  }
  async getRemoteBranches(remote) {
    const res = await this.git.branch(["-r", "--list", `${remote}*`], (err) => this.onError(err));
    console.log(remote);
    console.log(res);
    const list = [];
    for (const item in res.branches) {
      list.push(res.branches[item].name);
    }
    return list;
  async getRemotes() {
    const res = await this.git.remote([], (err) => this.onError(err));
    if (res) {
      return res.trim().split("\n");
    } else {
      return [];
    }
  }
  async removeRemote(remoteName) {
    await this.git.removeRemote(remoteName);
  }
  async updateUpstreamBranch(remoteBranch) {
    try {
      await this.git.branch(["--set-upstream-to", remoteBranch]);
    } catch (e) {
      console.error(e);
        await this.git.branch(["--set-upstream", remoteBranch]);
      } catch (e2) {
        console.error(e2);
        await this.git.push(["--set-upstream", ...remoteBranch.split("/")], (err) => this.onError(err));
    }
  async getDiffString(filePath, stagedChanges = false) {
    if (stagedChanges)
      return await this.git.diff(["--cached", "--", filePath]);
    else
      return await this.git.diff(["--", filePath]);
  async diff(file, commit1, commit2) {
    return await this.git.diff([`${commit1}..${commit2}`, "--", file]);
      const networkFailure = error.message.contains("Could not resolve host") || error.message.match(/ssh: connect to host .*? port .*?: Operation timed out/);
var ObsidianGitSettingsTab = class extends import_obsidian7.PluginSettingTab {
    const { containerEl } = this;
      new import_obsidian7.Setting(containerEl).setName("Split automatic commit and push").setDesc("Enable to use separate timer for commit and push").addToggle((toggle) => toggle.setValue(plugin.settings.differentIntervalCommitAndPush).onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName(`Vault ${commitOrBackup} interval (minutes)`).setDesc(`${plugin.settings.differentIntervalCommitAndPush ? "Commit" : "Commit and push"} changes every X minutes. Set to 0 (default) to disable. (See below setting for further configuration!)`).addText((text2) => text2.setValue(String(plugin.settings.autoSaveInterval)).onChange((value) => {
            new import_obsidian7.Notice(`Automatic ${commitOrBackup} enabled! Every ${plugin.settings.autoSaveInterval} minutes.`);
            plugin.clearAutoBackup() && new import_obsidian7.Notice(`Automatic ${commitOrBackup} disabled!`);
          new import_obsidian7.Notice("Please specify a valid number.");
      new import_obsidian7.Setting(containerEl).setName(`If turned on, do auto ${commitOrBackup} every X minutes after last change. Prevents auto ${commitOrBackup} while editing a file. If turned off, do auto ${commitOrBackup} every X minutes. It's independent from last change.`).addToggle((toggle) => toggle.setValue(plugin.settings.autoBackupAfterFileChange).onChange((value) => {
        new import_obsidian7.Setting(containerEl).setName(`Vault push interval (minutes)`).setDesc("Push changes every X minutes. Set to 0 (default) to disable.").addText((text2) => text2.setValue(String(plugin.settings.autoPushInterval)).onChange((value) => {
              new import_obsidian7.Notice(`Automatic push enabled! Every ${plugin.settings.autoPushInterval} minutes.`);
              plugin.clearAutoPush() && new import_obsidian7.Notice("Automatic push disabled!");
            new import_obsidian7.Notice("Please specify a valid number.");
      new import_obsidian7.Setting(containerEl).setName("Auto pull interval (minutes)").setDesc("Pull changes every X minutes. Set to 0 (default) to disable.").addText((text2) => text2.setValue(String(plugin.settings.autoPullInterval)).onChange((value) => {
            new import_obsidian7.Notice(`Automatic pull enabled! Every ${plugin.settings.autoPullInterval} minutes.`);
            plugin.clearAutoPull() && new import_obsidian7.Notice("Automatic pull disabled!");
          new import_obsidian7.Notice("Please specify a valid number.");
      new import_obsidian7.Setting(containerEl).setName("Commit message on manual backup/commit").setDesc("Available placeholders: {{date}} (see below), {{hostname}} (see below) and {{numFiles}} (number of changed files in the commit)").addText((text2) => text2.setPlaceholder("vault backup: {{date}}").setValue(plugin.settings.commitMessage ? plugin.settings.commitMessage : "").onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName("Specify custom commit message on auto backup").setDesc("You will get a pop up to specify your message").addToggle((toggle) => toggle.setValue(plugin.settings.customMessageOnAutoBackup).onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName("Commit message on auto backup/commit").setDesc("Available placeholders: {{date}} (see below), {{hostname}} (see below) and {{numFiles}} (number of changed files in the commit)").addText((text2) => text2.setPlaceholder("vault backup: {{date}}").setValue(plugin.settings.autoCommitMessage).onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName("{{date}} placeholder format").setDesc('Specify custom date format. E.g. "YYYY-MM-DD HH:mm:ss"').addText((text2) => text2.setPlaceholder(plugin.settings.commitDateFormat).setValue(plugin.settings.commitDateFormat).onChange(async (value) => {
        await plugin.saveSettings();
      }));
      new import_obsidian7.Setting(containerEl).setName("{{hostname}} placeholder replacement").setDesc("Specify custom hostname for every device.").addText((text2) => {
        var _a2;
        return text2.setValue((_a2 = plugin.localStorage.getHostname()) != null ? _a2 : "").onChange(async (value) => {
          plugin.localStorage.setHostname(value);
        });
      });
      new import_obsidian7.Setting(containerEl).setName("Preview commit message").addButton((button) => button.setButtonText("Preview").onClick(async () => {
        const commitMessagePreview = await plugin.gitManager.formatCommitMessage(plugin.settings.commitMessage);
        new import_obsidian7.Notice(`${commitMessagePreview}`);
      }));
      new import_obsidian7.Setting(containerEl).setName("List filenames affected by commit in the commit body").addToggle((toggle) => toggle.setValue(plugin.settings.listChangedFilesInMessageBody).onChange((value) => {
        new import_obsidian7.Setting(containerEl).setName("Sync Method").setDesc("Selects the method used for handling new changes found in your remote git repository.").addDropdown((dropdown) => {
          dropdown.onChange(async (option) => {
          });
      new import_obsidian7.Setting(containerEl).setName("Pull updates on startup").setDesc("Automatically pull updates when Obsidian starts").addToggle((toggle) => toggle.setValue(plugin.settings.autoPullOnBoot).onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName("Push on backup").setDesc("Disable to only commit changes").addToggle((toggle) => toggle.setValue(!plugin.settings.disablePush).onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName("Pull changes before push").setDesc("Commit -> pull -> push (Only if pushing is enabled)").addToggle((toggle) => toggle.setValue(plugin.settings.pullBeforePush).onChange((value) => {
    new import_obsidian7.Setting(containerEl).setName("Automatically refresh Source Control View on file changes").setDesc("On slower machines this may cause lags. If so, just disable this option").addToggle((toggle) => toggle.setValue(plugin.settings.refreshSourceControl).onChange((value) => {
    new import_obsidian7.Setting(containerEl).setName("Source Control View refresh interval").setDesc("Milliseconds to wait after file change before refreshing the Source Control View").addText((toggle) => toggle.setValue(plugin.settings.refreshSourceControlTimer.toString()).setPlaceholder("7000").onChange((value) => {
    new import_obsidian7.Setting(containerEl).setName("Disable notifications").setDesc("Disable notifications for git operations to minimize distraction (refer to status bar for updates). Errors are still shown as notifications even if you enable this setting").addToggle((toggle) => toggle.setValue(plugin.settings.disablePopups).onChange((value) => {
    new import_obsidian7.Setting(containerEl).setName("Show status bar").setDesc("Obsidian must be restarted for the changes to take affect").addToggle((toggle) => toggle.setValue(plugin.settings.showStatusBar).onChange((value) => {
    new import_obsidian7.Setting(containerEl).setName("Show branch status bar").setDesc("Obsidian must be restarted for the changes to take affect").addToggle((toggle) => toggle.setValue(plugin.settings.showBranchStatusBar).onChange((value) => {
      plugin.settings.showBranchStatusBar = value;
      plugin.saveSettings();
    }));
    new import_obsidian7.Setting(containerEl).setName("Show changes files count in status bar").addToggle((toggle) => toggle.setValue(plugin.settings.changedFilesInStatusBar).onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName("Update submodules").setDesc('"Create backup" and "pull" takes care of submodules. Missing features: Conflicted files, count of pulled/pushed/committed files. Tracking branch needs to be set for each submodule').addToggle((toggle) => toggle.setValue(plugin.settings.updateSubmodules).onChange((value) => {
      new import_obsidian7.Setting(containerEl).setName("Custom Git binary path").addText((cb) => {
        var _a2;
        cb.setValue((_a2 = plugin.localStorage.getGitPath()) != null ? _a2 : "");
      new import_obsidian7.Setting(containerEl).setName("Username on your git server. E.g. your username on GitHub").addText((cb) => {
      new import_obsidian7.Setting(containerEl).setName("Password/Personal access token").setDesc("Type in your password. You won't be able to see it again.").addText((cb) => {
      new import_obsidian7.Setting(containerEl).setName("Author name for commit").addText(async (cb) => {
        cb.setValue(await plugin.gitManager.getConfig("user.name"));
      });
      new import_obsidian7.Setting(containerEl).setName("Author email for commit").addText(async (cb) => {
        cb.setValue(await plugin.gitManager.getConfig("user.email"));
      });
    new import_obsidian7.Setting(containerEl).setName("Custom base path (Git repository path)").setDesc(`
    new import_obsidian7.Setting(containerEl).setName("Disable on this device").addToggle((toggle) => toggle.setValue(plugin.localStorage.getPluginDisabled()).onChange((value) => {
      new import_obsidian7.Notice("Obsidian must be restarted for the changes to take affect");
    new import_obsidian7.Setting(containerEl).setName("Donate").setDesc("If you like this Plugin, consider donating to support continued development.").addButton((bt) => {
    if (import_obsidian7.Platform.isMacOS === true) {
var import_obsidian8 = __toModule(require("obsidian"));
        (0, import_obsidian8.setIcon)(this.iconEl, "refresh-cw");
        (0, import_obsidian8.setIcon)(this.iconEl, "refresh-w");
        (0, import_obsidian8.setIcon)(this.iconEl, "git-commit");
        (0, import_obsidian8.setIcon)(this.iconEl, "upload");
        (0, import_obsidian8.setIcon)(this.iconEl, "download");
        (0, import_obsidian8.setIcon)(this.iconEl, "alert-circle");
        (0, import_obsidian8.setIcon)(this.iconEl, "alert-triangle");
      (0, import_obsidian8.setIcon)(this.iconEl, "globe");
      (0, import_obsidian8.setIcon)(this.iconEl, "check");
var import_obsidian9 = __toModule(require("obsidian"));
var ChangedFilesModal = class extends import_obsidian9.FuzzySuggestModal {
var import_obsidian10 = __toModule(require("obsidian"));
var CustomMessageModal = class extends import_obsidian10.SuggestModal {
var import_obsidian11 = __toModule(require("obsidian"));
  refreshSourceControl: import_obsidian11.Platform.isDesktopApp,
  refreshSourceControlTimer: 7e3,
  showBranchStatusBar: true
    this.prefix = this.plugin.manifest.id + ":";
  }
  migrate() {
    const keys = ["password", "hostname", "conflict", "lastAutoPull", "lastAutoBackup", "lastAutoPush", "gitPath", "pluginDisabled"];
    for (const key2 of keys) {
      const old = localStorage.getItem(this.prefix + key2);
      if (app.loadLocalStorage(this.prefix + key2) == null && old != null) {
        if (old != null) {
          app.saveLocalStorage(this.prefix + key2, old);
          localStorage.removeItem(this.prefix + key2);
        }
      }
    }
    return app.loadLocalStorage(this.prefix + "password");
    return app.saveLocalStorage(this.prefix + "password", value);
    return app.loadLocalStorage(this.prefix + "hostname");
    return app.saveLocalStorage(this.prefix + "hostname", value);
    return app.loadLocalStorage(this.prefix + "conflict");
    return app.saveLocalStorage(this.prefix + "conflict", value);
    return app.loadLocalStorage(this.prefix + "lastAutoPull");
    return app.saveLocalStorage(this.prefix + "lastAutoPull", value);
    return app.loadLocalStorage(this.prefix + "lastAutoBackup");
    return app.saveLocalStorage(this.prefix + "lastAutoBackup", value);
    return app.loadLocalStorage(this.prefix + "lastAutoPush");
    return app.saveLocalStorage(this.prefix + "lastAutoPush", value);
    return app.loadLocalStorage(this.prefix + "gitPath");
    return app.saveLocalStorage(this.prefix + "gitPath", value);
    return app.loadLocalStorage(this.prefix + "pluginDisabled") == "true";
    return app.saveLocalStorage(this.prefix + "pluginDisabled", `${value}`);
var import_obsidian12 = __toModule(require("obsidian"));
async function openLineInGitHub(editor, file, manager) {
  const { isGitHub, branch: branch2, repo, user } = await getData(manager);
  if (isGitHub) {
    const from = editor.getCursor("from").line + 1;
    const to = editor.getCursor("to").line + 1;
    if (from === to) {
      window.open(`https://github.com/${user}/${repo}/blob/${branch2}/${path2}?plain=1#L${from}`);
      window.open(`https://github.com/${user}/${repo}/blob/${branch2}/${path2}?plain=1#L${from}-L${to}`);
  } else {
    new import_obsidian12.Notice("It seems like you are not using GitHub");
  }
async function openHistoryInGitHub(file, manager) {
  const { isGitHub, branch: branch2, repo, user } = await getData(manager);
  const path2 = manager.getPath(file.path, true);
  if (isGitHub) {
    window.open(`https://github.com/${user}/${repo}/commits/${branch2}/${path2}`);
  } else {
    new import_obsidian12.Notice("It seems like you are not using GitHub");
  }
}
async function getData(manager) {
  const branchInfo = await manager.branchInfo();
  const remoteBranch = branchInfo.tracking;
  const branch2 = branchInfo.current;
  const remote = remoteBranch.substring(0, remoteBranch.indexOf("/"));
  const remoteUrl = await manager.getConfig(`remote.${remote}.url`);
  const [isGitHub, httpsUser, httpsRepo, sshUser, sshRepo] = remoteUrl.match(/(?:^https:\/\/github\.com\/(.*)\/(.*)\.git$)|(?:^git@github\.com:(.*)\/(.*)\.git$)/);
  return {
    isGitHub: !!isGitHub,
    repo: httpsRepo || sshRepo,
    user: httpsUser || sshUser,
    branch: branch2
  };
  var diffLines2 = diffInput.replace(/\\ No newline at end of file/g, "").replace(/\r\n?/g, "\n").split("\n");
      currentFile.deletedLines++;
      currentLine.type = LineType.DELETE;
      currentLine.oldNumber = oldLine++;
      currentLine.newNumber = void 0;
    } else {
      currentLine.type = LineType.CONTEXT;
      currentLine.oldNumber = oldLine++;
      currentLine.newNumber = newLine++;
    currentBlock.lines.push(currentLine);
  function existHunkHeader(line, lineIdx) {
    var idx = lineIdx;
    while (idx < diffLines2.length - 3) {
      if (line.startsWith("diff")) {
        return false;
      }
      if (diffLines2[idx].startsWith(oldFileNameHeader) && diffLines2[idx + 1].startsWith(newFileNameHeader) && diffLines2[idx + 2].startsWith(hunkHeaderPrefix)) {
        return true;
      }
      idx++;
    return false;
  diffLines2.forEach(function(line, lineIndex) {
    if (!line || line.startsWith("*")) {
      return;
    }
    var values;
    var prevLine = diffLines2[lineIndex - 1];
    var nxtLine = diffLines2[lineIndex + 1];
    var afterNxtLine = diffLines2[lineIndex + 2];
    if (line.startsWith("diff")) {
      startFile();
      var gitDiffStart = /^diff --git "?([a-ciow]\/.+)"? "?([a-ciow]\/.+)"?/;
      if (values = gitDiffStart.exec(line)) {
        possibleOldName = getFilename(values[1], void 0, config.dstPrefix);
        possibleNewName = getFilename(values[2], void 0, config.srcPrefix);
      }
      if (currentFile === null) {
        throw new Error("Where is my file !!!");
      currentFile.isGitDiff = true;
      return;
    if (!currentFile || !currentFile.isGitDiff && currentFile && line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) && afterNxtLine.startsWith(hunkHeaderPrefix)) {
      startFile();
    if (currentFile === null || currentFile === void 0 ? void 0 : currentFile.isTooBig) {
      return;
    }
    if (currentFile && (typeof config.diffMaxChanges === "number" && currentFile.addedLines + currentFile.deletedLines > config.diffMaxChanges || typeof config.diffMaxLineLength === "number" && line.length > config.diffMaxLineLength)) {
      currentFile.isTooBig = true;
      currentFile.addedLines = 0;
      currentFile.deletedLines = 0;
      currentFile.blocks = [];
      currentBlock = null;
      var message = typeof config.diffTooBigMessage === "function" ? config.diffTooBigMessage(files.length) : "Diff too big to be displayed";
      startBlock(message);
      return;
    }
    if (line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) || line.startsWith(newFileNameHeader) && prevLine.startsWith(oldFileNameHeader)) {
      if (currentFile && !currentFile.oldName && line.startsWith("--- ") && (values = getSrcFilename(line, config.srcPrefix))) {
        currentFile.oldName = values;
        currentFile.language = getExtension(currentFile.oldName, currentFile.language);
        return;
      }
      if (currentFile && !currentFile.newName && line.startsWith("+++ ") && (values = getDstFilename(line, config.dstPrefix))) {
        currentFile.newName = values;
        currentFile.language = getExtension(currentFile.newName, currentFile.language);
        return;
      }
    }
    if (currentFile && (line.startsWith(hunkHeaderPrefix) || currentFile.isGitDiff && currentFile.oldName && currentFile.newName && !currentBlock)) {
      startBlock(line);
      return;
    }
    if (currentBlock && (line.startsWith("+") || line.startsWith("-") || line.startsWith(" "))) {
      createLine(line);
      return;
    }
    var doesNotExistHunkHeader = !existHunkHeader(line, lineIndex);
    if (currentFile === null) {
      throw new Error("Where is my file !!!");
    }
    if (values = oldMode.exec(line)) {
      currentFile.oldMode = values[1];
    } else if (values = newMode.exec(line)) {
      currentFile.newMode = values[1];
    } else if (values = deletedFileMode.exec(line)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    } else if (values = newFileMode.exec(line)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = copyFrom.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = copyTo.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = renameFrom.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = renameTo.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = binaryFiles.exec(line)) {
      currentFile.isBinary = true;
      currentFile.oldName = getFilename(values[1], void 0, config.srcPrefix);
      currentFile.newName = getFilename(values[2], void 0, config.dstPrefix);
      startBlock("Binary file");
    } else if (binaryDiff.test(line)) {
      currentFile.isBinary = true;
      startBlock(line);
    } else if (values = similarityIndex.exec(line)) {
      currentFile.unchangedPercentage = parseInt(values[1], 10);
    } else if (values = dissimilarityIndex.exec(line)) {
      currentFile.changedPercentage = parseInt(values[1], 10);
    } else if (values = index2.exec(line)) {
      currentFile.checksumBefore = values[1];
      currentFile.checksumAfter = values[2];
      values[3] && (currentFile.mode = values[3]);
    } else if (values = combinedIndex.exec(line)) {
      currentFile.checksumBefore = [values[2], values[3]];
      currentFile.checksumAfter = values[1];
    } else if (values = combinedMode.exec(line)) {
      currentFile.oldMode = [values[2], values[3]];
      currentFile.newMode = values[1];
    } else if (values = combinedNewFile.exec(line)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = combinedDeletedFile.exec(line)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    }
  });
  saveBlock();
  saveFile();
  return files;

// node_modules/diff2html/lib-esm/file-list-renderer.js
init_polyfill_buffer();

// node_modules/diff2html/lib-esm/render-utils.js
init_polyfill_buffer();
var import_obsidian13 = __toModule(require("obsidian"));
var DiffView = class extends import_obsidian13.ItemView {
    this.navigation = true;
  async setState(state, result) {
    this.state = state;
    await this.refresh();
    return;
  async refresh() {
    var _a2;
    if (((_a2 = this.state) == null ? void 0 : _a2.file) && !this.gettingDiff && this.plugin.gitManager) {
      this.gettingDiff = true;
      let diff2 = await this.plugin.gitManager.getDiffString(this.state.file, this.state.staged);
      this.contentEl.empty();
      if (!diff2) {
        const content = await this.app.vault.adapter.read(this.plugin.gitManager.getVaultPath(this.state.file));
        const header = `--- /dev/null
        diff2 = [...header.split("\n"), ...content.split("\n").map((line) => `+${line}`)].join("\n");
      const diffEl = this.parser.parseFromString(html(diff2), "text/html").querySelector(".d2h-file-diff");
      this.contentEl.append(diffEl);
      this.gettingDiff = false;
    }
// src/ui/modals/branchModal.ts
var import_obsidian14 = __toModule(require("obsidian"));
var BranchModal = class extends import_obsidian14.FuzzySuggestModal {
  constructor(branches) {
    super(app);
    this.branches = branches;
    this.setPlaceholder("Select branch to checkout");
  }
  getItems() {
    return this.branches;
  }
  getItemText(item) {
    return item;
  }
  onChooseItem(item, evt) {
    this.resolve(item);
  async onClose() {
    await new Promise((resolve) => setTimeout(resolve, 10));
var import_obsidian15 = __toModule(require("obsidian"));
var IgnoreModal = class extends import_obsidian15.Modal {
    const { contentEl, titleEl } = this;
    }).addEventListener("click", async () => {
    });
    const { contentEl } = this;
var import_obsidian22 = __toModule(require("obsidian"));
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function set_style(node, key2, value, important) {
  if (value === null) {
    node.style.removeProperty(key2);
  } else {
    node.style.setProperty(key2, value, important ? "important" : "");
  }
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
  "inert",
  "itemscope",
  const { fragment, after_update } = component.$$;
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
    ctx: [],
  let ready = false;
      if (ready)
  ready = true;
      if (!is_function(callback)) {
        return noop;
      }
    if (!is_function(callback)) {
      return noop;
    }
var import_obsidian21 = __toModule(require("obsidian"));
var import_obsidian18 = __toModule(require("obsidian"));
var import_obsidian16 = __toModule(require("obsidian"));
var import_obsidian17 = __toModule(require("obsidian"));
var DiscardModal = class extends import_obsidian17.Modal {
    const { contentEl, titleEl } = this;
    }).addEventListener("click", async () => {
    });
    const { contentEl } = this;
  append_styles(target, "svelte-1o25zf2", "main.svelte-1o25zf2 .nav-file-title-content.svelte-1o25zf2.svelte-1o25zf2{display:flex;align-items:center}main.svelte-1o25zf2 .tools.svelte-1o25zf2.svelte-1o25zf2{display:flex;margin-left:auto}main.svelte-1o25zf2 .tools .type.svelte-1o25zf2.svelte-1o25zf2{padding-left:var(--size-2-1);display:flex;align-items:center;justify-content:center}main.svelte-1o25zf2 .tools .type[data-type=M].svelte-1o25zf2.svelte-1o25zf2{color:orange}main.svelte-1o25zf2 .tools .type[data-type=D].svelte-1o25zf2.svelte-1o25zf2{color:red}main.svelte-1o25zf2 .tools .buttons.svelte-1o25zf2.svelte-1o25zf2{display:flex}main.svelte-1o25zf2 .tools .buttons.svelte-1o25zf2>.svelte-1o25zf2{padding:0 0;height:auto}");
      attr(div, "class", "clickable-icon svelte-1o25zf2");
      ctx[11](div);
        dispose = [
          listen(div, "auxclick", ctx[5]),
          listen(div, "click", ctx[5])
        ];
      ctx[11](null);
      run_all(dispose);
  var _a2;
  let div6;
  let div0;
  let t0_value = ((_a2 = ctx[0].vault_path.split("/").last()) == null ? void 0 : _a2.replace(".md", "")) + "";
  let div5;
  let t3;
  let div2;
  let div4;
  let div4_data_type_value;
  let div6_aria_label_value;
      div6 = element("div");
      div0 = element("div");
      div5 = element("div");
      t3 = space();
      div2 = element("div");
      div4 = element("div");
      attr(div0, "class", "nav-file-title-content svelte-1o25zf2");
      attr(div1, "data-icon", "skip-back");
      attr(div1, "aria-label", "Discard");
      attr(div1, "class", "clickable-icon svelte-1o25zf2");
      attr(div2, "data-icon", "plus");
      attr(div2, "aria-label", "Stage");
      attr(div2, "class", "clickable-icon svelte-1o25zf2");
      attr(div3, "class", "buttons svelte-1o25zf2");
      attr(div4, "class", "type svelte-1o25zf2");
      attr(div4, "data-type", div4_data_type_value = ctx[0].working_dir);
      attr(div5, "class", "tools svelte-1o25zf2");
      attr(div6, "class", "nav-file-title");
      attr(div6, "aria-label-position", ctx[3]);
      attr(div6, "aria-label", div6_aria_label_value = ctx[0].vault_path.split("/").last() != ctx[0].vault_path ? ctx[0].vault_path : "");
      attr(main, "class", "nav-file svelte-1o25zf2");
      append2(main, div6);
      append2(div6, div0);
      append2(div0, t0);
      append2(div6, t1);
      append2(div6, div5);
      append2(div5, div3);
        if_block.m(div3, null);
      append2(div3, t2);
      append2(div3, div1);
      ctx[12](div1);
      append2(div3, t3);
      append2(div3, div2);
      ctx[13](div2);
      append2(div5, t4);
      append2(div5, div4);
      append2(div4, t5);
          listen(div0, "click", ctx[7]),
          listen(div0, "auxclick", ctx[7]),
          listen(div1, "click", ctx[8]),
          listen(div2, "click", ctx[6]),
          listen(div6, "click", self2(ctx[7])),
          listen(div6, "auxclick", self2(ctx[7])),
          listen(main, "focus", ctx[10])
      var _a3;
      if (dirty & 1 && t0_value !== (t0_value = ((_a3 = ctx2[0].vault_path.split("/").last()) == null ? void 0 : _a3.replace(".md", "")) + ""))
          if_block.m(div3, t2);
      if (dirty & 1 && div4_data_type_value !== (div4_data_type_value = ctx2[0].working_dir)) {
        attr(div4, "data-type", div4_data_type_value);
      }
      if (dirty & 8) {
        attr(div6, "aria-label-position", ctx2[3]);
      }
      if (dirty & 1 && div6_aria_label_value !== (div6_aria_label_value = ctx2[0].vault_path.split("/").last() != ctx2[0].vault_path ? ctx2[0].vault_path : "")) {
        attr(div6, "aria-label", div6_aria_label_value);
      ctx[12](null);
  window.setTimeout(() => buttons.forEach((b) => (0, import_obsidian18.setIcon)(b, b.getAttr("data-icon"))), 0);
    var _a2;
    const file = view.app.vault.getAbstractFileByPath(change.vault_path);
    console.log(event);
    if (file instanceof import_obsidian18.TFile) {
      (_a2 = getNewLeaf(event)) === null || _a2 === void 0 ? void 0 : _a2.openFile(file);
    var _a2;
    (_a2 = getNewLeaf(event)) === null || _a2 === void 0 ? void 0 : _a2.setViewState({
      type: DIFF_VIEW_CONFIG.type,
      active: true,
      state: { file: change.path, staged: false }
    });
  function div1_binding($$value) {
  function div2_binding($$value) {
    div1_binding,
    div2_binding
    init2(this, options, instance, create_fragment, safe_not_equal, { change: 0, view: 1, manager: 9 }, add_css);
var import_obsidian19 = __toModule(require("obsidian"));
  append_styles(target, "svelte-sajhpp", "main.svelte-sajhpp .nav-file-title-content.svelte-sajhpp{display:flex;align-items:center}main.svelte-sajhpp .tools.svelte-sajhpp{display:flex;margin-left:auto}main.svelte-sajhpp .tools .type.svelte-sajhpp{padding-left:var(--size-2-1);display:flex;align-items:center;justify-content:center}main.svelte-sajhpp .tools .type[data-type=M].svelte-sajhpp{color:orange}main.svelte-sajhpp .tools .type[data-type=D].svelte-sajhpp{color:red}");
  var _a2;
  let div2;
  let div0;
  let t0_value = ((_a2 = ctx[0].vault_path.split("/").last()) == null ? void 0 : _a2.replace(".md", "")) + "";
  let div1;
  let span;
  let span_data_type_value;
  let div2_aria_label_value;
      div2 = element("div");
      div0 = element("div");
      div1 = element("div");
      span = element("span");
      attr(div0, "class", "nav-file-title-content svelte-sajhpp");
      attr(span, "class", "type svelte-sajhpp");
      attr(span, "data-type", span_data_type_value = ctx[0].working_dir);
      attr(div1, "class", "tools svelte-sajhpp");
      attr(div2, "class", "nav-file-title");
      attr(div2, "aria-label-position", ctx[1]);
      attr(div2, "aria-label", div2_aria_label_value = ctx[0].vault_path.split("/").last() != ctx[0].vault_path ? ctx[0].vault_path : "");
      attr(main, "class", "nav-file svelte-sajhpp");
      append2(main, div2);
      append2(div2, div0);
      append2(div0, t0);
      append2(div2, t1);
      append2(div2, div1);
      append2(div1, span);
      append2(span, t2);
          listen(main, "click", ctx[3]),
      var _a3;
      if (dirty & 1 && t0_value !== (t0_value = ((_a3 = ctx2[0].vault_path.split("/").last()) == null ? void 0 : _a3.replace(".md", "")) + ""))
      if (dirty & 1 && span_data_type_value !== (span_data_type_value = ctx2[0].working_dir)) {
        attr(span, "data-type", span_data_type_value);
      }
      if (dirty & 2) {
        attr(div2, "aria-label-position", ctx2[1]);
      }
      if (dirty & 1 && div2_aria_label_value !== (div2_aria_label_value = ctx2[0].vault_path.split("/").last() != ctx2[0].vault_path ? ctx2[0].vault_path : "")) {
        attr(div2, "aria-label", div2_aria_label_value);
    var _a2;
    const file = view.app.vault.getAbstractFileByPath(change.vault_path);
    if (file instanceof import_obsidian19.TFile) {
      (_a2 = getNewLeaf(event)) === null || _a2 === void 0 ? void 0 : _a2.openFile(file);
var import_obsidian20 = __toModule(require("obsidian"));
  append_styles(target, "svelte-1o25zf2", "main.svelte-1o25zf2 .nav-file-title-content.svelte-1o25zf2.svelte-1o25zf2{display:flex;align-items:center}main.svelte-1o25zf2 .tools.svelte-1o25zf2.svelte-1o25zf2{display:flex;margin-left:auto}main.svelte-1o25zf2 .tools .type.svelte-1o25zf2.svelte-1o25zf2{padding-left:var(--size-2-1);display:flex;align-items:center;justify-content:center}main.svelte-1o25zf2 .tools .type[data-type=M].svelte-1o25zf2.svelte-1o25zf2{color:orange}main.svelte-1o25zf2 .tools .type[data-type=D].svelte-1o25zf2.svelte-1o25zf2{color:red}main.svelte-1o25zf2 .tools .buttons.svelte-1o25zf2.svelte-1o25zf2{display:flex}main.svelte-1o25zf2 .tools .buttons.svelte-1o25zf2>.svelte-1o25zf2{padding:0 0;height:auto}");
      attr(div, "class", "clickable-icon svelte-1o25zf2");
  var _a2;
  let div5;
  let div0;
  let t0_value = ((_a2 = ctx[3].split("/").last()) == null ? void 0 : _a2.replace(".md", "")) + "";
  let div4;
  let div1;
  let div3;
  let div3_data_type_value;
  let div5_aria_label_value;
      div5 = element("div");
      div0 = element("div");
      div4 = element("div");
      div1 = element("div");
      div3 = element("div");
      attr(div0, "class", "nav-file-title-content svelte-1o25zf2");
      attr(div1, "data-icon", "minus");
      attr(div1, "aria-label", "Unstage");
      attr(div1, "class", "clickable-icon svelte-1o25zf2");
      attr(div2, "class", "buttons svelte-1o25zf2");
      attr(div3, "class", "type svelte-1o25zf2");
      attr(div3, "data-type", div3_data_type_value = ctx[0].index);
      attr(div4, "class", "tools svelte-1o25zf2");
      attr(div5, "class", "nav-file-title");
      attr(div5, "aria-label-position", ctx[4]);
      attr(div5, "aria-label", div5_aria_label_value = ctx[3].split("/").last() != ctx[3] ? ctx[3] : "");
      attr(main, "class", "nav-file svelte-1o25zf2");
      append2(main, div5);
      append2(div5, div0);
      append2(div0, t0);
      append2(div5, t1);
      append2(div5, div4);
      append2(div4, div2);
        if_block.m(div2, null);
      append2(div2, t2);
      append2(div2, div1);
      ctx[12](div1);
      append2(div4, t3);
      append2(div4, div3);
      append2(div3, t4);
          listen(div0, "click", ctx[7]),
          listen(div0, "auxclick", ctx[7]),
          listen(div1, "click", ctx[8]),
          listen(div5, "click", self2(ctx[7])),
      var _a3;
      if (dirty & 8 && t0_value !== (t0_value = ((_a3 = ctx2[3].split("/").last()) == null ? void 0 : _a3.replace(".md", "")) + ""))
          if_block.m(div2, t2);
      if (dirty & 1 && div3_data_type_value !== (div3_data_type_value = ctx2[0].index)) {
        attr(div3, "data-type", div3_data_type_value);
      }
      if (dirty & 16) {
        attr(div5, "aria-label-position", ctx2[4]);
      }
      if (dirty & 8 && div5_aria_label_value !== (div5_aria_label_value = ctx2[3].split("/").last() != ctx2[3] ? ctx2[3] : "")) {
        attr(div5, "aria-label", div5_aria_label_value);
  window.setTimeout(() => buttons.forEach((b) => (0, import_obsidian20.setIcon)(b, b.getAttr("data-icon"), 16)), 0);
    var _a2;
    const file = view.app.vault.getAbstractFileByPath(change.vault_path);
    if (file instanceof import_obsidian20.TFile) {
      (_a2 = getNewLeaf(event)) === null || _a2 === void 0 ? void 0 : _a2.openFile(file);
    var _a2;
    (_a2 = getNewLeaf(event)) === null || _a2 === void 0 ? void 0 : _a2.setViewState({
      type: DIFF_VIEW_CONFIG.type,
      active: true,
      state: { file: change.path, staged: true }
    });
  function div1_binding($$value) {
    div1_binding
  append_styles(target, "svelte-148wteu", "main.svelte-148wteu .nav-folder-title-content.svelte-148wteu.svelte-148wteu{display:flex;align-items:center}main.svelte-148wteu .tools.svelte-148wteu.svelte-148wteu{display:flex;margin-left:auto}main.svelte-148wteu .tools .buttons.svelte-148wteu.svelte-148wteu{display:flex}main.svelte-148wteu .tools .buttons.svelte-148wteu>.svelte-148wteu{padding:0 0;height:auto}");
  child_ctx[14] = list[i];
  let div5;
  let div4;
  let div1;
  let t1_value = ctx[14].title + "";
  let div3;
  let div2;
  let t3;
  let t4;
    return ctx[9](ctx[14]);
  }
  function click_handler_1() {
    return ctx[10](ctx[14]);
  }
  function select_block_type_2(ctx2, dirty) {
    if (ctx2[3] == FileType.staged)
      return create_if_block_5;
    return create_else_block_1;
  }
  let current_block_type = select_block_type_2(ctx, -1);
  let if_block0 = current_block_type(ctx);
  function click_handler_4() {
    return ctx[13](ctx[14]);
  let if_block1 = !ctx[5][ctx[14].title] && create_if_block_4(ctx);
      div5 = element("div");
      div4 = element("div");
      div0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle"><path d="M3 8L12 17L21 8"></path></svg>`;
      div1 = element("div");
      div3 = element("div");
      div2 = element("div");
      if_block0.c();
      t3 = space();
      if (if_block1)
        if_block1.c();
      t4 = space();
      attr(div0, "class", "nav-folder-collapse-indicator collapse-icon");
      attr(div1, "class", "nav-folder-title-content svelte-148wteu");
      attr(div2, "class", "buttons svelte-148wteu");
      attr(div3, "class", "tools svelte-148wteu");
      attr(div4, "class", "nav-folder-title");
      attr(div5, "class", "nav-folder");
      toggle_class(div5, "is-collapsed", ctx[5][ctx[14].title]);
      insert(target, div5, anchor);
      append2(div5, div4);
      append2(div4, div0);
      append2(div4, t0);
      append2(div4, div1);
      append2(div1, t1);
      append2(div4, t2);
      append2(div4, div3);
      append2(div3, div2);
      if_block0.m(div2, null);
      append2(div5, t3);
      if (if_block1)
        if_block1.m(div5, null);
      append2(div5, t4);
        dispose = [
          listen(div0, "click", click_handler),
          listen(div1, "click", click_handler_1),
          listen(div4, "click", self2(click_handler_4))
        ];
      if ((!current || dirty & 1) && t1_value !== (t1_value = ctx[14].title + ""))
      if (current_block_type === (current_block_type = select_block_type_2(ctx, dirty)) && if_block0) {
        if_block0.p(ctx, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div2, null);
        }
      if (!ctx[5][ctx[14].title]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
            transition_in(if_block1, 1);
          if_block1 = create_if_block_4(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div5, t4);
      } else if (if_block1) {
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
      if (!current || dirty & 33) {
        toggle_class(div5, "is-collapsed", ctx[5][ctx[14].title]);
      }
      transition_in(if_block1);
      transition_out(if_block1);
        detach(div5);
      if_block0.d();
      if (if_block1)
        if_block1.d();
      run_all(dispose);
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
    }
  };
}
function create_else_block_1(ctx) {
  let div;
  let mounted;
  let dispose;
  function click_handler_3() {
    return ctx[12](ctx[14]);
  }
  return {
    c() {
      div = element("div");
      div.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-plus"><line x1="9" y1="4" x2="9" y2="14"></line><line x1="4" y1="9" x2="14" y2="9"></line></svg>`;
      attr(div, "data-icon", "plus");
      attr(div, "aria-label", "Stage");
      attr(div, "class", "clickable-icon svelte-148wteu");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (!mounted) {
        dispose = listen(div, "click", click_handler_3);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_5(ctx) {
  let div;
  let mounted;
  let dispose;
  function click_handler_2() {
    return ctx[11](ctx[14]);
  }
  return {
    c() {
      div = element("div");
      div.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-minus"><line x1="4" y1="9" x2="14" y2="9"></line></svg>`;
      attr(div, "data-icon", "minus");
      attr(div, "aria-label", "Unstage");
      attr(div, "class", "clickable-icon svelte-148wteu");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (!mounted) {
        dispose = listen(div, "click", click_handler_2);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      mounted = false;
      dispose();
      hierarchy: ctx[14],
      attr(div, "class", "nav-folder-children");
        treecomponent_changes.hierarchy = ctx2[14];
            div_transition = create_bidirectional_transition(div, slide, { duration: 150 }, true);
          div_transition = create_bidirectional_transition(div, slide, { duration: 150 }, false);
      change: ctx[14].statusResult,
        pulledfilecomponent_changes.change = ctx2[14].statusResult;
      change: ctx[14].statusResult,
      view: ctx[2]
        filecomponent_changes.change = ctx2[14].statusResult;
      change: ctx[14].statusResult,
        stagedfilecomponent_changes.change = ctx2[14].statusResult;
    if (ctx2[14].statusResult)
      attr(main, "class", "svelte-148wteu");
      if (dirty & 495) {
  function stage(path2) {
    plugin.gitManager.stageAll({ dir: path2 }).finally(() => {
      dispatchEvent(new CustomEvent("git-refresh"));
    });
  }
  function unstage(path2) {
    plugin.gitManager.unstageAll({ dir: path2 }).finally(() => {
      dispatchEvent(new CustomEvent("git-refresh"));
    });
  }
  function fold(item) {
    $$invalidate(5, closed[item.title] = !closed[item.title], closed);
  }
  const click_handler = (entity) => fold(entity);
  const click_handler_1 = (entity) => fold(entity);
  const click_handler_2 = (entity) => unstage(entity.title);
  const click_handler_3 = (entity) => stage(entity.path);
  const click_handler_4 = (entity) => fold(entity);
  return [
    hierarchy,
    plugin,
    view,
    fileType,
    topLevel,
    closed,
    stage,
    unstage,
    fold,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4
  ];
  append_styles(target, "svelte-1u4uc91", `.commit-msg-input.svelte-1u4uc91{width:100%;min-height:33px;height:30px;resize:vertical;padding:7px 5px;background-color:var(--background-modifier-form-field)}.git-commit-msg.svelte-1u4uc91{position:relative;padding:0;width:calc(100% - var(--size-4-8));margin:4px auto}.git-commit-msg-clear-button.svelte-1u4uc91{position:absolute;background:transparent;border-radius:50%;color:var(--search-clear-button-color);cursor:var(--cursor);top:0px;right:2px;bottom:0px;line-height:0;height:var(--input-height);width:28px;margin:auto;padding:0 0;text-align:center;display:flex;justify-content:center;align-items:center;transition:color 0.15s ease-in-out}.git-commit-msg-clear-button.svelte-1u4uc91:after{content:"";height:var(--search-clear-button-size);width:var(--search-clear-button-size);display:block;background-color:currentColor;-webkit-mask-image:url("data:image/svg+xml,<svg viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM3.8705 3.09766L6.00003 5.22718L8.12955 3.09766L8.9024 3.8705L6.77287 6.00003L8.9024 8.12955L8.12955 8.9024L6.00003 6.77287L3.8705 8.9024L3.09766 8.12955L5.22718 6.00003L3.09766 3.8705L3.8705 3.09766Z' fill='currentColor'/></svg>");-webkit-mask-repeat:no-repeat}.tree-item-flair.svelte-1u4uc91{margin-left:auto;align-items:center}`);
      attr(div, "class", "git-commit-msg-clear-button svelte-1u4uc91");
  let div9;
  let div8;
  let div0;
  let t0;
  let span0;
  let div4;
  let t6;
  let span1;
      div9 = element("div");
      div8 = element("div");
      div0 = element("div");
      div0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle"><path d="M3 8L12 17L21 8"></path></svg>`;
      t0 = space();
      div1.textContent = "Staged Changes";
      span0 = element("span");
      div4 = element("div");
      div4.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle"><path d="M3 8L12 17L21 8"></path></svg>`;
      t6 = space();
      div5.textContent = "Changes";
      span1 = element("span");
      attr(div0, "class", "nav-folder-collapse-indicator collapse-icon");
      attr(div1, "class", "nav-folder-title-content");
      attr(span0, "class", "tree-item-flair svelte-1u4uc91");
      attr(div2, "class", "nav-folder-title");
      attr(div3, "class", "staged nav-folder");
      toggle_class(div3, "is-collapsed", !ctx[13]);
      attr(div4, "class", "nav-folder-collapse-indicator collapse-icon");
      attr(div5, "class", "nav-folder-title-content");
      attr(span1, "class", "tree-item-flair svelte-1u4uc91");
      attr(div6, "class", "nav-folder-title");
      attr(div7, "class", "changes nav-folder");
      toggle_class(div7, "is-collapsed", !ctx[12]);
      attr(div8, "class", "nav-folder-children");
      attr(div9, "class", "nav-folder mod-root");
      insert(target, div9, anchor);
      append2(div9, div8);
      append2(div8, div3);
      append2(div2, div0);
      append2(div2, t0);
      append2(div2, span0);
      append2(span0, t3);
      append2(div8, t5);
      append2(div8, div7);
      append2(div6, div4);
      append2(div6, t6);
      append2(div6, span1);
      append2(span1, t9);
      append2(div8, t11);
        if_block2.m(div8, null);
      if (!current || dirty[0] & 8192) {
        toggle_class(div3, "is-collapsed", !ctx2[13]);
      }
      if (!current || dirty[0] & 4096) {
        toggle_class(div7, "is-collapsed", !ctx2[12]);
      }
          if_block2.m(div8, null);
        detach(div9);
        if_block2.d();
      attr(div, "class", "nav-folder-children");
  const if_block_creators = [create_if_block_52, create_else_block_12];
      attr(div, "class", "nav-folder-children");
function create_else_block_12(ctx) {
function create_if_block_52(ctx) {
      manager: ctx[0].gitManager
  let div0;
  let t0;
  let span;
      div0 = element("div");
      div0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle"><path d="M3 8L12 17L21 8"></path></svg>`;
      t0 = space();
      div1.textContent = "Recently Pulled Files";
      span = element("span");
      attr(div0, "class", "nav-folder-collapse-indicator collapse-icon");
      attr(div1, "class", "nav-folder-title-content");
      attr(span, "class", "tree-item-flair svelte-1u4uc91");
      attr(div2, "class", "nav-folder-title");
      attr(div3, "class", "pulled nav-folder");
      toggle_class(div3, "is-collapsed", !ctx[14]);
      append2(div2, div0);
      append2(div2, t0);
      append2(div2, span);
      append2(span, t3);
      if (!current || dirty[0] & 16384) {
        toggle_class(div3, "is-collapsed", !ctx2[14]);
      }
      attr(div, "class", "nav-folder-children");
  let div8;
  let div7;
  let div6;
  let div9;
  let if_block1 = ctx[5] && ctx[10] && ctx[9] && create_if_block4(ctx);
      div8 = element("div");
      div7 = element("div");
      div6 = element("div");
      div9 = element("div");
      attr(div0, "class", "clickable-icon nav-action-button");
      attr(div1, "class", "clickable-icon nav-action-button");
      attr(div2, "class", "clickable-icon nav-action-button");
      attr(div3, "class", "clickable-icon nav-action-button");
      attr(div4, "class", "clickable-icon nav-action-button");
      attr(div5, "class", "clickable-icon nav-action-button");
      attr(div6, "id", "refresh");
      attr(div6, "class", "clickable-icon nav-action-button");
      attr(div6, "data-icon", "refresh-cw");
      attr(div6, "aria-label", "Refresh");
      toggle_class(div6, "loading", ctx[4]);
      attr(div7, "class", "nav-buttons-container");
      attr(div8, "class", "nav-header");
      attr(textarea, "class", "commit-msg-input svelte-1u4uc91");
      attr(div9, "class", "git-commit-msg svelte-1u4uc91");
      attr(div10, "class", "nav-files-container");
      set_style(div10, "position", "relative");
      append2(main, div8);
      append2(div8, div7);
      append2(div7, div0);
      append2(div7, t0);
      append2(div7, div1);
      append2(div7, t1);
      append2(div7, div2);
      append2(div7, t2);
      append2(div7, div3);
      append2(div7, t3);
      append2(div7, div4);
      append2(div7, t4);
      append2(div7, div5);
      append2(div7, t5);
      append2(div7, div6);
      ctx[27](div6);
      append2(main, t6);
      append2(main, div9);
      append2(div9, textarea);
      append2(div9, t7);
        if_block0.m(div9, null);
          listen(div6, "click", triggerRefresh),
        toggle_class(div6, "loading", ctx2[4]);
          if_block0.m(div9, null);
      if (ctx2[5] && ctx2[10] && ctx2[9]) {
          if (dirty[0] & 1568) {
      buttons.forEach((btn) => (0, import_obsidian21.setIcon)(btn, btn.getAttr("data-icon"), 16));
      (0, import_obsidian21.setIcon)(layoutBtn, showTree ? "list" : "folder", 16);
  async function commit2() {
    $$invalidate(4, loading = true);
    if (status2) {
      if (await plugin.hasTooBigFiles(status2.staged)) {
    }
  async function refresh() {
    if (!plugin.gitReady) {
      $$invalidate(5, status2 = void 0);
      return;
    }
    $$invalidate(5, status2 = plugin.cachedStatus);
    if (plugin.lastPulledFiles && plugin.lastPulledFiles != lastPulledFiles) {
      $$invalidate(6, lastPulledFiles = plugin.lastPulledFiles);
      $$invalidate(11, lastPulledFilesHierarchy = {
        title: "",
        path: "",
        children: plugin.gitManager.getTreeStructure(lastPulledFiles)
      });
    }
    if (status2) {
      const sort = (a, b) => {
        return a.vault_path.split("/").last().localeCompare(b.vault_path.split("/").last());
      };
      status2.changed.sort(sort);
      status2.staged.sort(sort);
      if (status2.changed.length + status2.staged.length > 500) {
        if (!plugin.loading) {
          plugin.displayError("Too many changes to display");
        $$invalidate(9, changeHierarchy = {
          title: "",
          path: "",
          children: plugin.gitManager.getTreeStructure(status2.changed)
        });
        $$invalidate(10, stagedHierarchy = {
          title: "",
          path: "",
          children: plugin.gitManager.getTreeStructure(status2.staged)
        });
    } else {
      $$invalidate(9, changeHierarchy = void 0);
      $$invalidate(10, stagedHierarchy = void 0);
    }
    $$invalidate(4, loading = plugin.loading);
    plugin.push().finally(triggerRefresh);
  function div6_binding($$value) {
          (0, import_obsidian21.setIcon)(layoutBtn, showTree ? "list" : "folder", 16);
    div6_binding,
var GitView2 = class extends import_obsidian22.ItemView {
// src/ui/statusBar/branchStatusBar.ts
init_polyfill_buffer();
var BranchStatusBar = class {
  constructor(statusBarEl, plugin) {
    this.statusBarEl = statusBarEl;
    this.plugin = plugin;
    this.statusBarEl.addClass("mod-clickable");
    this.statusBarEl.onClickEvent((e) => {
      this.plugin.switchBranch();
    });
  }
  async display() {
    if (this.plugin.gitReady) {
      const branchInfo = await this.plugin.gitManager.branchInfo();
      if (branchInfo.current != void 0) {
        this.statusBarEl.setText(branchInfo.current);
      } else {
        this.statusBarEl.empty();
      }
    } else {
      this.statusBarEl.empty();
    }
  }
};

var ObsidianGit = class extends import_obsidian23.Plugin {
  async updateCachedStatus() {
    this.cachedStatus = await this.gitManager.status();
    return this.cachedStatus;
  async refresh() {
    const gitView = this.app.workspace.getLeavesOfType(GIT_VIEW_CONFIG.type);
    if (this.settings.changedFilesInStatusBar || gitView.length > 0) {
      this.loading = true;
      dispatchEvent(new CustomEvent("git-view-refresh"));
      await this.updateCachedStatus();
      this.loading = false;
      dispatchEvent(new CustomEvent("git-view-refresh"));
    }
  }
  async onload() {
    console.log("loading " + this.manifest.name + " plugin");
    this.localStorage = new LocalStorageSettings(this);
    this.localStorage.migrate();
    await this.loadSettings();
    this.migrateSettings();
    this.addSettingTab(new ObsidianGitSettingsTab(this.app, this));
    if (!this.localStorage.getPluginDisabled()) {
      this.loadPlugin();
    }
  }
  async loadPlugin() {
    addEventListener("git-refresh", this.refresh.bind(this));
    this.registerView(GIT_VIEW_CONFIG.type, (leaf) => {
      return new GitView2(leaf, this);
    });
    this.registerView(DIFF_VIEW_CONFIG.type, (leaf) => {
      return new DiffView(leaf, this);
    });
    this.app.workspace.registerHoverLinkSource(GIT_VIEW_CONFIG.type, {
      display: "Git View",
      defaultMod: true
    });
    this.setRefreshDebouncer();
    this.addCommand({
      id: "edit-gitignore",
      name: "Edit .gitignore",
      callback: async () => {
        const content = await this.app.vault.adapter.read(this.gitManager.getVaultPath(".gitignore"));
        const modal = new IgnoreModal(this.app, content);
        const res = await modal.open();
        if (res !== void 0) {
          await this.app.vault.adapter.write(this.gitManager.getVaultPath(".gitignore"), res);
          this.refresh();
        }
      }
    });
    this.addCommand({
      id: "open-git-view",
      name: "Open source control view",
      callback: async () => {
        const leafs = this.app.workspace.getLeavesOfType(GIT_VIEW_CONFIG.type);
        let leaf;
        if (leafs.length === 0) {
          leaf = this.app.workspace.getRightLeaf(false);
          await leaf.setViewState({
            type: GIT_VIEW_CONFIG.type
          });
        } else {
          leaf = leafs.first();
        }
        this.app.workspace.revealLeaf(leaf);
        dispatchEvent(new CustomEvent("git-refresh"));
    this.addCommand({
      id: "open-diff-view",
      name: "Open diff view",
      checkCallback: (checking) => {
        var _a2;
        const file = this.app.workspace.getActiveFile();
        if (checking) {
          return file !== null;
        } else {
          (_a2 = getNewLeaf()) == null ? void 0 : _a2.setViewState({ type: DIFF_VIEW_CONFIG.type, state: { staged: false, file: file.path } });
        }
    this.addCommand({
      id: "view-file-on-github",
      name: "Open file on GitHub",
      editorCallback: (editor, { file }) => openLineInGitHub(editor, file, this.gitManager)
    });
    this.addCommand({
      id: "view-history-on-github",
      name: "Open file history on GitHub",
      editorCallback: (_, { file }) => openHistoryInGitHub(file, this.gitManager)
    });
    this.addCommand({
      id: "pull",
      name: "Pull",
      callback: () => this.promiseQueue.addTask(() => this.pullChangesFromRemote())
    });
    this.addCommand({
      id: "add-to-gitignore",
      name: "Add file to gitignore",
      checkCallback: (checking) => {
        const file = app.workspace.getActiveFile();
        if (checking) {
          return file !== null;
        } else {
          app.vault.adapter.append(this.gitManager.getVaultPath(".gitignore"), "\n" + this.gitManager.getPath(file.path, true)).then(() => {
          });
      }
    });
    this.addCommand({
      id: "push",
      name: "Create backup",
      callback: () => this.promiseQueue.addTask(() => this.createBackup(false))
    });
    this.addCommand({
      id: "backup-and-close",
      name: "Create backup and close",
      callback: () => this.promiseQueue.addTask(async () => {
        await this.createBackup(false);
        window.close();
      })
    });
    this.addCommand({
      id: "commit-push-specified-message",
      name: "Create backup with specific message",
      callback: () => this.promiseQueue.addTask(() => this.createBackup(false, true))
    });
    this.addCommand({
      id: "commit",
      name: "Commit all changes",
      callback: () => this.promiseQueue.addTask(() => this.commit(false))
    });
    this.addCommand({
      id: "commit-specified-message",
      name: "Commit all changes with specific message",
      callback: () => this.promiseQueue.addTask(() => this.commit(false, true))
    });
    this.addCommand({
      id: "commit-staged",
      name: "Commit staged",
      callback: () => this.promiseQueue.addTask(() => this.commit(false, false, true))
    });
    this.addCommand({
      id: "commit-staged-specified-message",
      name: "Commit staged with specific message",
      callback: () => this.promiseQueue.addTask(() => this.commit(false, true, true))
    });
    this.addCommand({
      id: "push2",
      name: "Push",
      callback: () => this.promiseQueue.addTask(() => this.push())
    });
    this.addCommand({
      id: "stage-current-file",
      name: "Stage current file",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (checking) {
          return file !== null;
        } else {
          this.promiseQueue.addTask(() => this.stageFile(file));
      }
    });
    this.addCommand({
      id: "unstage-current-file",
      name: "Unstage current file",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (checking) {
          return file !== null;
        } else {
          this.promiseQueue.addTask(() => this.unstageFile(file));
        }
      }
    });
    this.addCommand({
      id: "edit-remotes",
      name: "Edit remotes",
      callback: async () => this.editRemotes()
    });
    this.addCommand({
      id: "remove-remote",
      name: "Remove remote",
      callback: async () => this.removeRemote()
    });
    this.addCommand({
      id: "delete-repo",
      name: "CAUTION: Delete repository",
      callback: async () => {
        const repoExists = await this.app.vault.adapter.exists(`${this.settings.basePath}/.git`);
        if (repoExists) {
          const modal = new GeneralModal({ options: ["NO", "YES"], placeholder: "Do you really want to delete the repository (.git directory)? This action cannot be undone.", onlySelection: true });
          const shouldDelete = await modal.open() === "YES";
          if (shouldDelete) {
            await this.app.vault.adapter.rmdir(`${this.settings.basePath}/.git`, true);
            new import_obsidian23.Notice("Successfully deleted repository. Reloading plugin...");
            this.unloadPlugin();
            this.init();
        } else {
          new import_obsidian23.Notice("No repository found");
    this.addCommand({
      id: "init-repo",
      name: "Initialize a new repo",
      callback: async () => this.createNewRepo()
    });
    this.addCommand({
      id: "clone-repo",
      name: "Clone an existing remote repo",
      callback: async () => this.cloneNewRepo()
    });
    this.addCommand({
      id: "list-changed-files",
      name: "List changed files",
      callback: async () => {
        if (!await this.isAllInitialized())
          return;
        const status2 = await this.gitManager.status();
        this.setState(PluginState.idle);
        if (status2.changed.length + status2.staged.length > 500) {
          this.displayError("Too many changes to display");
          return;
        }
        new ChangedFilesModal(this, status2.changed).open();
      }
    });
    this.addCommand({
      id: "switch-branch",
      name: "Switch branch",
      callback: () => {
        this.switchBranch();
      }
    });
    this.addCommand({
      id: "create-branch",
      name: "Create new branch",
      callback: () => {
        this.createBranch();
      }
    });
    this.addCommand({
      id: "delete-branch",
      name: "Delete branch",
      callback: () => {
        this.deleteBranch();
      }
    });
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file, source) => {
      this.handleFileMenu(menu, file, source);
    }));
    if (this.settings.showStatusBar) {
      const statusBarEl = this.addStatusBarItem();
      this.statusBar = new StatusBar(statusBarEl, this);
      this.registerInterval(window.setInterval(() => {
        var _a2;
        return (_a2 = this.statusBar) == null ? void 0 : _a2.display();
      }, 1e3));
    }
    if (import_obsidian23.Platform.isDesktop && this.settings.showBranchStatusBar) {
      const branchStatusBarEl = this.addStatusBarItem();
      this.branchBar = new BranchStatusBar(branchStatusBarEl, this);
      this.registerInterval(window.setInterval(() => {
        var _a2;
        return (_a2 = this.branchBar) == null ? void 0 : _a2.display();
      }, 6e4));
    }
    this.app.workspace.onLayoutReady(() => this.init());
    this.debRefresh = (0, import_obsidian23.debounce)(() => {
  async showNotices() {
    const length = 1e4;
    if (this.manifest.id === "obsidian-git" && import_obsidian23.Platform.isDesktopApp && !this.settings.showedMobileNotice) {
      new import_obsidian23.Notice("Obsidian Git is now available on mobile! Please read the plugin's README for more information.", length);
      this.settings.showedMobileNotice = true;
      await this.saveSettings();
    }
    if (this.manifest.id === "obsidian-git-isomorphic") {
      new import_obsidian23.Notice("Obsidian Git Mobile is now deprecated. Please uninstall it and install Obsidian Git instead.", length);
    }
        this.promiseQueue.addTask(async () => {
          if (file instanceof import_obsidian23.TFile) {
            await this.gitManager.stage(file.path, true);
            await this.gitManager.stageAll({ dir: this.gitManager.getPath(file.path, true) });
        });
        this.promiseQueue.addTask(async () => {
          if (file instanceof import_obsidian23.TFile) {
            await this.gitManager.unstage(file.path, true);
            await this.gitManager.unstageAll({ dir: this.gitManager.getPath(file.path, true) });
        });
  async migrateSettings() {
      await this.saveSettings();
      await this.saveSettings();
      await this.saveSettings();
  async onunload() {
    this.app.workspace.unregisterHoverLinkSource(GIT_VIEW_CONFIG.type);
    this.unloadPlugin();
    console.log("unloading " + this.manifest.name + " plugin");
  async loadSettings() {
    let data = await this.loadData();
    if (data == void 0) {
      data = { showedMobileNotice: true };
    }
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
  async saveSettings() {
    await this.saveData(this.settings);
  async saveLastAuto(date, mode) {
    if (mode === "backup") {
      this.localStorage.setLastAutoBackup(date.toString());
    } else if (mode === "pull") {
      this.localStorage.setLastAutoPull(date.toString());
    } else if (mode === "push") {
      this.localStorage.setLastAutoPush(date.toString());
    }
  async loadLastAuto() {
    var _a2, _b, _c;
    return {
      "backup": new Date((_a2 = this.localStorage.getLastAutoBackup()) != null ? _a2 : ""),
      "pull": new Date((_b = this.localStorage.getLastAutoPull()) != null ? _b : ""),
      "push": new Date((_c = this.localStorage.getLastAutoPush()) != null ? _c : "")
    };
  async init() {
    var _a2;
    this.showNotices();
    try {
      if (import_obsidian23.Platform.isDesktopApp) {
        this.gitManager = new SimpleGit(this);
        await this.gitManager.setGitInstance();
      } else {
        this.gitManager = new IsomorphicGit(this);
      const result = await this.gitManager.checkRequirements();
      switch (result) {
        case "missing-git":
          this.displayError("Cannot run git command");
          break;
        case "missing-repo":
          new import_obsidian23.Notice("Can't find a valid git repository. Please create one via the given command or clone an existing repo.");
          break;
        case "valid":
          this.gitReady = true;
          this.setState(PluginState.idle);
          this.modifyEvent = this.app.vault.on("modify", () => {
            this.debRefresh();
          });
          this.deleteEvent = this.app.vault.on("delete", () => {
            this.debRefresh();
          });
          this.createEvent = this.app.vault.on("create", () => {
            this.debRefresh();
          });
          this.renameEvent = this.app.vault.on("rename", () => {
            this.debRefresh();
          });
          this.registerEvent(this.modifyEvent);
          this.registerEvent(this.deleteEvent);
          this.registerEvent(this.createEvent);
          this.registerEvent(this.renameEvent);
          (_a2 = this.branchBar) == null ? void 0 : _a2.display();
          dispatchEvent(new CustomEvent("git-refresh"));
          if (this.settings.autoPullOnBoot) {
            this.promiseQueue.addTask(() => this.pullChangesFromRemote());
          }
          const lastAutos = await this.loadLastAuto();
          if (this.settings.autoSaveInterval > 0) {
            const now2 = new Date();
            const diff2 = this.settings.autoSaveInterval - Math.round((now2.getTime() - lastAutos.backup.getTime()) / 1e3 / 60);
            this.startAutoBackup(diff2 <= 0 ? 0 : diff2);
          }
          if (this.settings.differentIntervalCommitAndPush && this.settings.autoPushInterval > 0) {
            const now2 = new Date();
            const diff2 = this.settings.autoPushInterval - Math.round((now2.getTime() - lastAutos.push.getTime()) / 1e3 / 60);
            this.startAutoPush(diff2 <= 0 ? 0 : diff2);
          if (this.settings.autoPullInterval > 0) {
            const now2 = new Date();
            const diff2 = this.settings.autoPullInterval - Math.round((now2.getTime() - lastAutos.pull.getTime()) / 1e3 / 60);
            this.startAutoPull(diff2 <= 0 ? 0 : diff2);
          break;
        default:
          console.log("Something weird happened. The 'checkRequirements' result is " + result);
      }
    } catch (error) {
      this.displayError(error);
      console.error(error);
    }
  }
  async createNewRepo() {
    await this.gitManager.init();
    new import_obsidian23.Notice("Initialized new repo");
    await this.init();
  }
  async cloneNewRepo() {
    const modal = new GeneralModal({ placeholder: "Enter remote URL" });
    const url = await modal.open();
    if (url) {
      const confirmOption = "Vault Root";
      let dir = await new GeneralModal({
        options: [confirmOption],
        placeholder: "Enter directory for clone. It needs to be empty or not existent.",
        allowEmpty: this.gitManager instanceof IsomorphicGit
      }).open();
      if (dir !== void 0) {
        if (dir === confirmOption) {
          dir = ".";
        }
        dir = (0, import_obsidian23.normalizePath)(dir);
        if (dir === "/") {
          dir = ".";
        }
        if (dir === ".") {
          const modal2 = new GeneralModal({ options: ["NO", "YES"], placeholder: `Does your remote repo contain a ${app.vault.configDir} directory at the root?`, onlySelection: true });
          const containsConflictDir = await modal2.open();
          if (containsConflictDir === void 0) {
            new import_obsidian23.Notice("Aborted clone");
            return;
          } else if (containsConflictDir === "YES") {
            const confirmOption2 = "DELETE ALL YOUR LOCAL CONFIG AND PLUGINS";
            const modal3 = new GeneralModal({ options: ["Abort clone", confirmOption2], placeholder: `To avoid conflicts, the local ${app.vault.configDir} directory needs to be deleted.`, onlySelection: true });
            const shouldDelete = await modal3.open() === confirmOption2;
            if (shouldDelete) {
              await this.app.vault.adapter.rmdir(app.vault.configDir, true);
            } else {
              new import_obsidian23.Notice("Aborted clone");
        }
        new import_obsidian23.Notice(`Cloning new repo into "${dir}"`);
        await this.gitManager.clone(url, dir);
        new import_obsidian23.Notice("Cloned new repo.");
        new import_obsidian23.Notice("Please restart Obsidian");
        if (dir && dir !== ".") {
          this.settings.basePath = dir;
          this.saveSettings();
    }
  async isAllInitialized() {
    if (!this.gitReady) {
      await this.init();
    }
    return this.gitReady;
  async pullChangesFromRemote() {
    if (!await this.isAllInitialized())
      return;
    const filesUpdated = await this.pull();
    if (!filesUpdated) {
      this.displayMessage("Everything is up-to-date");
    }
    if (this.gitManager instanceof SimpleGit) {
      const status2 = await this.gitManager.status();
      if (status2.conflicted.length > 0) {
        this.displayError(`You have ${status2.conflicted.length} conflict ${status2.conflicted.length > 1 ? "files" : "file"}`);
        this.handleConflict(status2.conflicted);
    }
    dispatchEvent(new CustomEvent("git-refresh"));
    this.lastUpdate = Date.now();
    this.setState(PluginState.idle);
  async createBackup(fromAutoBackup, requestCustomMessage = false) {
    if (!await this.isAllInitialized())
      return;
    if (this.settings.syncMethod == "reset" && this.settings.pullBeforePush) {
      await this.pull();
    }
    if (!await this.commit(fromAutoBackup, requestCustomMessage))
      return;
    if (!this.settings.disablePush) {
      if (await this.gitManager.canPush()) {
        if (this.settings.syncMethod != "reset" && this.settings.pullBeforePush) {
          await this.pull();
        await this.push();
      } else {
        this.displayMessage("No changes to push");
    }
    this.setState(PluginState.idle);
  async commit(fromAutoBackup, requestCustomMessage = false, onlyStaged = false) {
    if (!await this.isAllInitialized())
      return false;
    const hadConflict = this.localStorage.getConflict() === "true";
    let changedFiles;
    let status2;
    let unstagedFiles;
    if (this.gitManager instanceof SimpleGit) {
      const file = this.app.vault.getAbstractFileByPath(this.conflictOutputFile);
      if (file != null)
        await this.app.vault.delete(file);
      status2 = await this.updateCachedStatus();
      if (fromAutoBackup && status2.conflicted.length > 0) {
        this.displayError(`Did not commit, because you have ${status2.conflicted.length} conflict ${status2.conflicted.length > 1 ? "files" : "file"}. Please resolve them and commit per command.`);
        this.handleConflict(status2.conflicted);
      changedFiles = [...status2.changed, ...status2.staged];
    } else if (fromAutoBackup && hadConflict) {
      this.setState(PluginState.conflicted);
      this.displayError(`Did not commit, because you have conflict files. Please resolve them and commit per command.`);
      return false;
    } else if (hadConflict) {
      const file = this.app.vault.getAbstractFileByPath(this.conflictOutputFile);
      if (file != null)
        await this.app.vault.delete(file);
      status2 = await this.updateCachedStatus();
      changedFiles = [...status2.changed, ...status2.staged];
    } else {
      if (onlyStaged) {
        changedFiles = await this.gitManager.getStagedFiles();
      } else {
        unstagedFiles = await this.gitManager.getUnstagedFiles();
        changedFiles = unstagedFiles.map(({ filepath }) => ({ vault_path: this.gitManager.getVaultPath(filepath) }));
    }
    if (await this.hasTooBigFiles(changedFiles)) {
      this.setState(PluginState.idle);
      return false;
    }
    if (changedFiles.length !== 0 || hadConflict) {
      let commitMessage = fromAutoBackup ? this.settings.autoCommitMessage : this.settings.commitMessage;
      if (fromAutoBackup && this.settings.customMessageOnAutoBackup || requestCustomMessage) {
        if (!this.settings.disablePopups && fromAutoBackup) {
          new import_obsidian23.Notice("Auto backup: Please enter a custom commit message. Leave empty to abort");
        const tempMessage = await new CustomMessageModal(this, true).open();
        if (tempMessage != void 0 && tempMessage != "" && tempMessage != "...") {
          commitMessage = tempMessage;
          this.setState(PluginState.idle);
          return false;
      }
      let committedFiles;
      if (onlyStaged) {
        committedFiles = await this.gitManager.commit(commitMessage);
        committedFiles = await this.gitManager.commitAll({ message: commitMessage, status: status2, unstagedFiles });
      let roughly = false;
      if (committedFiles === void 0) {
        roughly = true;
        committedFiles = changedFiles.length;
      this.displayMessage(`Committed${roughly ? " approx." : ""} ${committedFiles} ${committedFiles > 1 ? "files" : "file"}`);
    } else {
      this.displayMessage("No changes to commit");
    }
    dispatchEvent(new CustomEvent("git-refresh"));
    this.setState(PluginState.idle);
    return true;
  async hasTooBigFiles(files) {
    var _a2;
    const branchInfo = await this.gitManager.branchInfo();
    const remote = (_a2 = branchInfo.tracking) == null ? void 0 : _a2.split("/")[0];
    if (remote) {
      const remoteUrl = await this.gitManager.getRemoteUrl(remote);
      if (remoteUrl == null ? void 0 : remoteUrl.includes("github.com")) {
        const tooBigFiles = files.filter((f) => {
          const file = this.app.vault.getAbstractFileByPath(f.vault_path);
          if (file instanceof import_obsidian23.TFile) {
            return file.stat.size >= 1e8;
          }
          return false;
        });
        if (tooBigFiles.length > 0) {
          this.displayError(`Did not commit, because following files are too big: ${tooBigFiles.map((e) => e.vault_path)}. Please remove them.`);
          return true;
    }
    return false;
  async push() {
    if (!await this.isAllInitialized())
      return false;
    if (!await this.remotesAreSet()) {
      return false;
    }
    const file = this.app.vault.getAbstractFileByPath(this.conflictOutputFile);
    const hadConflict = this.localStorage.getConflict() === "true";
    if (this.gitManager instanceof SimpleGit && file)
      await this.app.vault.delete(file);
    let status2;
    if (this.gitManager instanceof SimpleGit && (status2 = await this.updateCachedStatus()).conflicted.length > 0) {
      this.displayError(`Cannot push. You have ${status2.conflicted.length} conflict ${status2.conflicted.length > 1 ? "files" : "file"}`);
      this.handleConflict(status2.conflicted);
      return false;
    } else if (this.gitManager instanceof IsomorphicGit && hadConflict) {
      this.displayError(`Cannot push. You have conflict files`);
      this.setState(PluginState.conflicted);
      return false;
    }
    {
      console.log("Pushing....");
      const pushedFiles = await this.gitManager.push();
      console.log("Pushed!", pushedFiles);
      this.lastUpdate = Date.now();
      if (pushedFiles > 0) {
        this.displayMessage(`Pushed ${pushedFiles} ${pushedFiles > 1 ? "files" : "file"} to remote`);
      } else {
        this.displayMessage(`No changes to push`);
    }
  async pull() {
    if (!await this.remotesAreSet()) {
      return false;
    }
    const pulledFiles = await this.gitManager.pull() || [];
    this.offlineMode = false;
    if (pulledFiles.length > 0) {
      this.displayMessage(`Pulled ${pulledFiles.length} ${pulledFiles.length > 1 ? "files" : "file"} from remote`);
      this.lastPulledFiles = pulledFiles;
    }
    return pulledFiles.length != 0;
  async stageFile(file) {
    if (!await this.isAllInitialized())
      return false;
    await this.gitManager.stage(file.path, true);
    this.displayMessage(`Staged ${file.path}`);
    dispatchEvent(new CustomEvent("git-refresh"));
    this.setState(PluginState.idle);
    return true;
  }
  async unstageFile(file) {
    if (!await this.isAllInitialized())
      return false;
    await this.gitManager.unstage(file.path, true);
    this.displayMessage(`Unstaged ${file.path}`);
    dispatchEvent(new CustomEvent("git-refresh"));
    this.setState(PluginState.idle);
    return true;
  }
  async switchBranch() {
    var _a2;
    if (!await this.isAllInitialized())
      return;
    const branchInfo = await this.gitManager.branchInfo();
    const selectedBranch = await new BranchModal(branchInfo.branches).open();
    if (selectedBranch != void 0) {
      await this.gitManager.checkout(selectedBranch);
      this.displayMessage(`Switched to ${selectedBranch}`);
      (_a2 = this.branchBar) == null ? void 0 : _a2.display();
      return selectedBranch;
    }
  }
  async createBranch() {
    var _a2;
    if (!await this.isAllInitialized())
      return;
    const newBranch = await new GeneralModal({ placeholder: "Create new branch" }).open();
    if (newBranch != void 0) {
      await this.gitManager.createBranch(newBranch);
      this.displayMessage(`Created new branch ${newBranch}`);
      (_a2 = this.branchBar) == null ? void 0 : _a2.display();
      return newBranch;
    }
  }
  async deleteBranch() {
    var _a2;
    if (!await this.isAllInitialized())
      return;
    const branchInfo = await this.gitManager.branchInfo();
    if (branchInfo.current)
      branchInfo.branches.remove(branchInfo.current);
    const branch2 = await new GeneralModal({ options: branchInfo.branches, placeholder: "Delete branch", onlySelection: true }).open();
    if (branch2 != void 0) {
      let force = false;
      if (!await this.gitManager.branchIsMerged(branch2)) {
        const forceAnswer = await new GeneralModal({ options: ["YES", "NO"], placeholder: "This branch isn't merged into HEAD. Force delete?", onlySelection: true }).open();
        if (forceAnswer !== "YES") {
          return;
        force = forceAnswer === "YES";
      await this.gitManager.deleteBranch(branch2, force);
      this.displayMessage(`Deleted branch ${branch2}`);
      (_a2 = this.branchBar) == null ? void 0 : _a2.display();
      return branch2;
    }
  }
  async remotesAreSet() {
    if (!(await this.gitManager.branchInfo()).tracking) {
      new import_obsidian23.Notice("No upstream branch is set. Please select one.");
      const remoteBranch = await this.selectRemoteBranch();
      if (remoteBranch == void 0) {
        this.displayError("Aborted. No upstream-branch is set!", 1e4);
        this.setState(PluginState.idle);
        return false;
      } else {
        await this.gitManager.updateUpstreamBranch(remoteBranch);
        return true;
      }
    }
    return true;
        this.autoBackupDebouncer = (0, import_obsidian23.debounce)(() => this.doAutoBackup(), time, true);
  async handleConflict(conflicted) {
    this.setState(PluginState.conflicted);
    this.localStorage.setConflict("true");
    let lines;
    if (conflicted !== void 0) {
      lines = [
        "# Conflict files",
        "Please resolve them and commit per command (This file will be deleted before the commit).",
        ...conflicted.map((e) => {
          const file = this.app.vault.getAbstractFileByPath(e);
          if (file instanceof import_obsidian23.TFile) {
            const link = this.app.metadataCache.fileToLinktext(file, "/");
            return `- [[${link}]]`;
          } else {
            return `- Not a file: ${e}`;
          }
        })
      ];
    }
    this.writeAndOpenFile(lines == null ? void 0 : lines.join("\n"));
  async editRemotes() {
    if (!await this.isAllInitialized())
      return;
    const remotes = await this.gitManager.getRemotes();
    const nameModal = new GeneralModal({
      options: remotes,
      placeholder: "Select or create a new remote by typing its name and selecting it"
    });
    const remoteName = await nameModal.open();
    if (remoteName) {
      const oldUrl = await this.gitManager.getRemoteUrl(remoteName);
      const urlModal = new GeneralModal({ initialValue: oldUrl });
      const remoteURL = await urlModal.open();
      if (remoteURL) {
        await this.gitManager.setRemote(remoteName, remoteURL);
        return remoteName;
      }
    }
  }
  async selectRemoteBranch() {
    let remotes = await this.gitManager.getRemotes();
    let selectedRemote;
    if (remotes.length === 0) {
      selectedRemote = await this.editRemotes();
      if (selectedRemote == void 0) {
        remotes = await this.gitManager.getRemotes();
      }
    }
    const nameModal = new GeneralModal({ options: remotes, placeholder: "Select or create a new remote by typing its name and selecting it" });
    const remoteName = selectedRemote != null ? selectedRemote : await nameModal.open();
    if (remoteName) {
      this.displayMessage("Fetching remote branches");
      await this.gitManager.fetch(remoteName);
      const branches = await this.gitManager.getRemoteBranches(remoteName);
      const branchModal = new GeneralModal({ options: branches, placeholder: "Select or create a new remote branch by typing its name and selecting it" });
      return await branchModal.open();
    }
  }
  async removeRemote() {
    if (!await this.isAllInitialized())
      return;
    const remotes = await this.gitManager.getRemotes();
    const nameModal = new GeneralModal({ options: remotes, placeholder: "Select a remote" });
    const remoteName = await nameModal.open();
    if (remoteName) {
      this.gitManager.removeRemote(remoteName);
    }
  async writeAndOpenFile(text2) {
    if (text2 !== void 0) {
      await this.app.vault.adapter.write(this.conflictOutputFile, text2);
    }
    let fileIsAlreadyOpened = false;
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.getDisplayText() != "" && this.conflictOutputFile.startsWith(leaf.getDisplayText())) {
        fileIsAlreadyOpened = true;
    if (!fileIsAlreadyOpened) {
      this.app.workspace.openLinkText(this.conflictOutputFile, "/", true);
    }
      new import_obsidian23.Notice(message, 5 * 1e3);
    if (message instanceof Errors.UserCanceledError) {
      new import_obsidian23.Notice("Aborted");
      return;
    }
    new import_obsidian23.Notice(message, timeout);