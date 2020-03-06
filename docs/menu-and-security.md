---


---

<h1 id="menu-structure">Menu structure</h1>
<p>At the moment we have various random menu items, in no particular order and with zero security. Time to fix this</p>
<p>Let’s think about the ‘modules’ of the current attendance app:</p>
<ul>
<li>Volunteer registration</li>
<li>Volunteer Sign in</li>
<li>Pay now</li>
<li>Shop - ie evening maintenance classes</li>
<li>Servicing
<ul>
<li>New Service</li>
<li>Current jobs</li>
</ul>
</li>
<li>Parts ordering</li>
<li>Admin</li>
</ul>
<h2 id="menu">Menu</h2>
<p>Let’s organise these into a menu structure, so that we know which items are public and which are private (ie you need to be logged in to access them)</p>
<pre><code>* Public menu items
	* Shop
	* Volunteer registration
* Private menu items
	* Vol sign in 
	* Pay now
	* Servicing
		* New Service
		* Current jobs
	* Parts ordering
	* Administration
	* Superadmin
</code></pre>
<h2 id="roles">Roles</h2>
<p>We are now going to define some access roles. Each user will have access to one or more roles, and each role is associated with a module (as above)</p>
<p>Let’s have a look at some scenarios, and that will help us to understand how the roles will be applied</p>
<p>In the workshop<br>
* Private items<br>
* Vol sign in<br>
* Pay now<br>
* Servicing<br>
* New service<br>
* Current jobs<br>
* Parts ordering<br>
* Administration<br>
* Superadmin</p>
<p>At Sandridge Life Saving Club<br>
* Private items<br>
* Vol sign in</p>
<p>At Bikes for Humanity<br>
* Private items<br>
* Vol sign in<br>
* Administration</p>
<h2 id="typical-users">Typical users</h2>

<table>
<thead>
<tr>
<th>User</th>
<th>Roles</th>
</tr>
</thead>
<tbody>
<tr>
<td>Workshop @ back2bikes</td>
<td>signin, paynow, servicing, parts, admin</td>
</tr>
<tr>
<td>Mike @ back2bikes</td>
<td>signin, paynow, servicing, parts, admin, superadmin</td>
</tr>
<tr>
<td>Sandridge</td>
<td>signin</td>
</tr>
<tr>
<td>b4h</td>
<td>signin, admin</td>
</tr>
<tr>
<td>Jarad</td>
<td>signin, admin, shop, paynow</td>
</tr>
</tbody>
</table>
